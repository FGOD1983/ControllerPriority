import os
import subprocess
import datetime
import glob

class Plugin:
    PLUGIN_DIR = "/home/deck/homebrew/plugins/ControllerPriority"
    LOG_FILE = "/tmp/disable-steam-controller.log"

    def log(self, msg: str):
        try:
            timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            with open(self.LOG_FILE, "a") as f:
                f.write(f"{timestamp} - {msg}\n")
        except:
            pass

    def get_clean_env(self):
        clean_env = os.environ.copy()
        clean_env.pop("LD_PRELOAD", None)
        clean_env.pop("LD_LIBRARY_PATH", None)
        return clean_env

    def get_controller_ids(self):
        """Zoekt naar alle actieve HID poorten van de interne controller (3-3 of 1-1)."""
        # Zoek naar alle HID interfaces op de bekende interne USB bussen
        paths = glob.glob("/sys/bus/usb/drivers/usbhid/3-3:*") + glob.glob("/sys/bus/usb/drivers/usbhid/1-1:*")
        return [os.path.basename(p) for p in paths]

    async def check_status(self):
        """Controleert of de udev-rule fysiek aanwezig is."""
        target = "/etc/udev/rules.d/99-disable-steam-input.rules"
        return os.path.exists(target)

    async def check_bind_status(self):
        """Controleert of er op dit moment controller IDs 'gebonden' zijn aan de driver."""
        ids = self.get_controller_ids()
        return len(ids) > 0

    async def toggle_controller(self, disable: bool):
        """Directe sessie-toggle (bind/unbind) voor de interne controller."""
        action = "unbind" if disable else "bind"
        
        # Bij unbinden gebruiken we de actuele gevonden IDs. 
        # Bij binden proberen we de standaard poorten van de Steam Deck (3-3 en 1-1 bussen).
        if disable:
            target_ids = self.get_controller_ids()
        else:
            # We proberen alle mogelijke standaard IDs voor beide Deck revisies
            target_ids = ["3-3:1.0", "3-3:1.1", "3-3:1.2", "1-1:1.0", "1-1:1.1", "1-1:1.2"]
        
        success = True
        for dev_id in target_ids:
            # Gebruik tee om sudo schrijfrechten naar sysfs te krijgen
            cmd = f"echo '{dev_id}' | sudo tee /sys/bus/usb/drivers/usbhid/{action}"
            res = subprocess.run(cmd, shell=True, env=self.get_clean_env(), capture_output=True)
            # We loggen fouten maar gaan door voor de andere IDs
            if res.returncode != 0 and disable: 
                self.log(f"Toggle failed for {dev_id}: {res.stderr}")
        
        return success

    async def restore_udev_with_password(self, password: str):
        restore_script = os.path.join(self.PLUGIN_DIR, "restore_udev.sh")
        os.system(f"chmod +x {restore_script}")
        full_cmd = f"unset LD_PRELOAD; unset LD_LIBRARY_PATH; sudo -S {restore_script}"
        
        try:
            process = subprocess.Popen(full_cmd, shell=True, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, env=self.get_clean_env())
            stdout, stderr = process.communicate(input=password + "\n")
            return {"success": process.returncode == 0, "message": "Udev rules restored! ✅" if process.returncode == 0 else stderr}
        except Exception as e:
            return {"success": False, "message": str(e)}

    async def uninstall_udev_rule(self, password: str):
        # Verwijdert de rule en herlaadt udev zodat de controller direct weer werkt
        cmd = "sudo -S rm /etc/udev/rules.d/99-disable-steam-input.rules && sudo udevadm control --reload-rules && sudo udevadm trigger"
        try:
            process = subprocess.Popen(cmd, shell=True, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, env=self.get_clean_env())
            stdout, stderr = process.communicate(input=password + "\n")
            return {"success": process.returncode == 0, "message": "Udev rules removed! 🗑️" if process.returncode == 0 else stderr}
        except Exception as e:
            return {"success": False, "message": str(e)}

    async def _main(self):
        self.log("Backend loaded.")

    async def _unload(self):
        self.log("Backend shut down.")
