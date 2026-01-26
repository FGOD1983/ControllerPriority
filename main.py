import os
import subprocess
import datetime
import glob
import asyncio

class Plugin:
    PLUGIN_DIR = os.path.dirname(os.path.realpath(__file__))
    LOG_FILE = "/tmp/controller-priority.log"

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

    def is_controller(self, dev_id):
        """Checkt of een apparaat een controller is op basis van hardware eigenschappen."""
        dev_path = f"/sys/bus/usb/devices/{dev_id}"
        product_file = os.path.join(dev_path, "product")
        
        if not os.path.exists(product_file):
            return False

        try:
            with open(product_file, "r") as f:
                product_name = f.read().strip().lower()
            
            blacklist = ["hub", "lan", "radio", "storage", "ethernet", "bluetooth"]
            if any(x in product_name for x in blacklist):
                return False
            
            class_files = glob.glob(f"{dev_path}/{dev_id}:*/bInterfaceClass")
            for cf in class_files:
                with open(cf, "r") as f:
                    val = f.read().strip().lower()
                    if val in ["03", "3", "ff"]:
                        return True
        except: pass
        return False

    async def check_bind_status(self):
        """Checkt of de interne controller (3-3) actieve drivers heeft."""
        path = "/sys/bus/usb/devices/3-3:1.0/driver"
        return os.path.exists(path)

    async def get_external_controllers(self):
        """Haalt controllers op en checkt of ze ECHT verbonden zijn (niet alleen de dongle)."""
        controllers = []
        usb_bus_path = "/sys/bus/usb/devices/"
        any_controller_actually_connected = False
        
        try:
            for dev_id in os.listdir(usb_bus_path):
                if ":" in dev_id or dev_id.startswith("usb") or dev_id == "3-3":
                    continue
                
                if self.is_controller(dev_id):
                    dev_path = os.path.join(usb_bus_path, dev_id)
                    with open(os.path.join(dev_path, "product"), "r") as f:
                        name = f.read().strip()
                    
                    # 1. Is de USB-poort/dongle 'bound'? (Belangrijk voor de UI knop)
                    interface_drivers = glob.glob(f"{dev_path}/{dev_id}:*/driver")
                    usb_is_bound = len(interface_drivers) > 0
                    
                    # 2. Is de controller ECHT aan? (Zoek naar input nodes zoals js0 of eventX)
                    # Deze mappen verschijnen alleen als de controller draadloos linkt met de dongle
                    active_input_nodes = glob.glob(f"{dev_path}/{dev_id}:*/input/input*/event*")
                    real_connection = len(active_input_nodes) > 0
                    
                    if usb_is_bound and real_connection:
                        any_controller_actually_connected = True
                        
                    controllers.append({
                        "id": dev_id,
                        "name": name,
                        "is_bound": usb_is_bound  # UI toont de poort status
                    })

            # --- SAFETY GUARD LOGICA ---
            internal_active = await self.check_bind_status()
            
            # Als er geen enkele externe controller ECHT aan staat, MOET de interne pad aan
            if not any_controller_actually_connected and not internal_active:
                self.log("Safety: Geen actieve draadloze link gevonden. Herstel interne controller.")
                await self.toggle_controller(False, "internal")

        except Exception as e:
            self.log(f"Scan error: {str(e)}")
            
        return controllers

    async def toggle_controller(self, disable: bool, target_id: str = "internal"):
        """Ontkoppelt of koppelt drivers los via sysfs."""
        action = "unbind" if disable else "bind"
        base_id = "3-3" if target_id == "internal" else target_id

        interface_paths = glob.glob(f"/sys/bus/usb/devices/{base_id}:*")
        target_ids = [os.path.basename(x) for x in interface_paths]
        
        self.log(f"Actie: {action} op {target_id}. Interfaces: {target_ids}")

        for dev_id in target_ids:
            for d in ["usbhid", "xpad", "hid-generic"]:
                driver_path = f"/sys/bus/usb/drivers/{d}"
                if os.path.exists(f"{driver_path}/{dev_id}") or not disable:
                    try:
                        subprocess.run(f"echo '{dev_id}' | sudo tee {driver_path}/{action}", 
                                       shell=True, env=self.get_clean_env(), capture_output=True)
                    except: pass

        await asyncio.sleep(0.6)
        return True

    async def check_status(self):
        return os.path.exists("/etc/udev/rules.d/99-disable-steam-input.rules")

    async def restore_udev_with_password(self, password: str):
        restore_script = os.path.join(self.PLUGIN_DIR, "restore_udev.sh")
        os.system(f"chmod +x {restore_script}")
        try:
            process = subprocess.Popen(f"sudo -S {restore_script}", shell=True, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, env=self.get_clean_env())
            process.communicate(input=password + "\n")
            return {"success": True, "message": "Udev rules active"}
        except: return {"success": False, "message": "Failed"}

    async def uninstall_udev_rule(self, password: str):
        cmd = "sudo -S rm /etc/udev/rules.d/99-disable-steam-input.rules && sudo udevadm control --reload-rules && sudo udevadm trigger"
        try:
            process = subprocess.Popen(cmd, shell=True, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, env=self.get_clean_env())
            process.communicate(input=password + "\n")
            return {"success": True, "message": "Udev rules removed"}
        except: return {"success": False, "message": "Failed"}

    async def _main(self): pass
    async def _unload(self): pass
