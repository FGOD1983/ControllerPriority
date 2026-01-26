import os
import subprocess
import datetime
import glob

class Plugin:
    PLUGIN_DIR = os.path.dirname(os.path.realpath(__file__))
    LOG_FILE = "/tmp/disable-steam-controller.log"

    def log(self, msg: str):
        try:
            timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            with open(self.LOG_FILE, "a") as f:
                f.write(f"{timestamp} - {msg}\n")
        except: pass

    def get_clean_env(self):
        clean_env = os.environ.copy()
        clean_env.pop("LD_PRELOAD", None)
        clean_env.pop("LD_LIBRARY_PATH", None)
        return clean_env

    def get_usb_device_root(self, event_node):
        """Vertaalt dynamisch een event (event5) naar een fysiek USB-pad (1-1.3)."""
        try:
            sys_path = f"/sys/class/input/{event_node}/device"
            real_sys_path = os.path.realpath(sys_path)
            # We zoeken het deel van het pad dat de poort-interface definieert
            parts = real_sys_path.split('/')
            for part in reversed(parts):
                if ":" in part and "-" in part:
                    # Geeft de root terug, bijv. '1-1.3' (negeert de :1.0 interface)
                    return part.split(':')[0]
        except: pass
        return None

    async def get_external_controllers(self):
        """Scant de huidige situatie en koppelt controllers aan hun actuele USB-locatie."""
        path = "/dev/input/by-id/"
        controllers = {} 
        try:
            if os.path.exists(path):
                for filename in os.listdir(path):
                    # Alleen joysticks, negeer muis/toetsenbord emulatie voor de lijst
                    if "event-joystick" in filename:
                        real_path = os.path.realpath(os.path.join(path, filename))
                        event_node = os.path.basename(real_path)
                        usb_root = self.get_usb_device_root(event_node)
                        
                        if usb_root:
                            # Check status: is er een driver actief op een interface van deze poort?
                            # We gebruiken een wildcard voor interfaces (:1.0, :1.1 etc)
                            interfaces = glob.glob(f"/sys/bus/usb/devices/{usb_root}:*")
                            is_bound = any(os.path.exists(f"{i}/driver") for i in interfaces)
                            
                            display_name = filename.replace("usb-", "").replace("-event-joystick", "").replace("_", " ")
                            
                            # Gebruik usb_root als sleutel om stabiel te blijven bij interface-switches
                            controllers[usb_root] = {
                                "id": usb_root,
                                "name": display_name,
                                "is_bound": is_bound
                            }
        except Exception as e:
            self.log(f"Scan error: {str(e)}")
        
        return list(controllers.values())

    async def toggle_controller(self, disable: bool, target_id: str = "internal"):
        """Toggelt chirurgisch alle drivers op een specifieke locatie."""
        action = "unbind" if disable else "bind"
        
        if target_id == "internal":
            target_ids = ["3-3:1.0", "3-3:1.1", "3-3:1.2", "1-1:1.0", "1-1:1.1", "1-1:1.2"]
        else:
            # Dynamisch alle interfaces vinden voor de gekozen fysieke poort
            target_ids = [os.path.basename(x) for x in glob.glob(f"/sys/bus/usb/devices/{target_id}:*")]

        # We proberen alle relevante drivers. Als een controller switcht van HID naar XPAD,
        # vangen we dat hier op door beide drivers te proberen.
        drivers = ["usbhid", "xpad"]
        
        for dev_id in target_ids:
            for d in drivers:
                driver_path = f"/sys/bus/usb/drivers/{d}/{dev_id}"
                # Alleen commando sturen als de driver dit device echt heeft (bij unbind)
                # of altijd proberen bij bind.
                if os.path.exists(driver_path) or not disable:
                    cmd = f"echo '{dev_id}' | sudo tee /sys/bus/usb/drivers/{d}/{action}"
                    subprocess.run(cmd, shell=True, env=self.get_clean_env(), capture_output=True)
        
        return True

    # --- Udev & Status Checks (ongewijzigd) ---
    async def check_status(self):
        return os.path.exists("/etc/udev/rules.d/99-disable-steam-input.rules")

    async def check_bind_status(self):
        paths = glob.glob("/sys/bus/usb/drivers/usbhid/3-3:*") + glob.glob("/sys/bus/usb/drivers/usbhid/1-1:*")
        return len(paths) > 0

    async def restore_udev_with_password(self, password: str):
        restore_script = os.path.join(self.PLUGIN_DIR, "restore_udev.sh")
        os.system(f"chmod +x {restore_script}")
        try:
            process = subprocess.Popen(f"sudo -S {restore_script}", shell=True, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, env=self.get_clean_env())
            stdout, stderr = process.communicate(input=password + "\n")
            return {"success": process.returncode == 0, "message": "Udev rules installed!" if process.returncode == 0 else stderr}
        except Exception as e: return {"success": False, "message": str(e)}

    async def uninstall_udev_rule(self, password: str):
        cmd = "sudo -S rm /etc/udev/rules.d/99-disable-steam-input.rules && sudo udevadm control --reload-rules && sudo udevadm trigger"
        try:
            process = subprocess.Popen(cmd, shell=True, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, env=self.get_clean_env())
            stdout, stderr = process.communicate(input=password + "\n")
            return {"success": process.returncode == 0, "message": "Udev rules removed!" if process.returncode == 0 else stderr}
        except Exception as e: return {"success": False, "message": str(e)}

    async def _main(self): pass
    async def _unload(self): pass
