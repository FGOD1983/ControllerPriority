import os
import subprocess
import datetime

class Plugin:
    # Define paths
    PLUGIN_DIR = "/home/deck/homebrew/plugins/ControllerPriority"
    LOG_FILE = "/tmp/disable-steam-controller.log"

    def log(self, msg: str):
        """Logs actions to /tmp/disable-steam-controller.log"""
        try:
            timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            with open(self.LOG_FILE, "a") as f:
                f.write(f"{timestamp} - {msg}\n")
        except:
            pass

    def get_clean_env(self):
        """Returns an environment without LD_PRELOAD to prevent library errors."""
        clean_env = os.environ.copy()
        clean_env.pop("LD_PRELOAD", None)
        clean_env.pop("LD_LIBRARY_PATH", None)
        return clean_env

    async def check_status(self):
        """Checks if the udev rules are present on the system."""
        target = "/etc/udev/rules.d/99-disable-steam-input.rules"
        exists = os.path.exists(target)
        self.log(f"Status check: {'Present' if exists else 'Missing'}")
        return exists

    async def restore_udev_with_password(self, password: str):
        """Executes the external restore_udev.sh script with sudo."""
        self.log("Starting system restore via external script...")
        
        restore_script = os.path.join(self.PLUGIN_DIR, "restore_udev.sh")
        
        # Ensure the script is executable
        os.system(f"chmod +x {restore_script}")

        # Command: unset variables and run script with sudo -S
        full_cmd = f"unset LD_PRELOAD; unset LD_LIBRARY_PATH; sudo -S {restore_script}"

        try:
            process = subprocess.Popen(
                full_cmd,
                shell=True,
                executable="/bin/bash",
                stdin=subprocess.PIPE,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                env=self.get_clean_env()
            )
            
            stdout, stderr = process.communicate(input=password + "\n")

            if process.returncode == 0:
                self.log("restore_udev.sh executed successfully.")
                return {"success": True, "message": "System restored successfully! ✅"}
            else:
                self.log(f"Script error (Code {process.returncode}): {stderr}")
                if "incorrect password" in stderr.lower():
                    return {"success": False, "message": "Incorrect password."}
                return {"success": False, "message": f"Error: {stderr[:50]}"}

        except Exception as e:
            self.log(f"Python error during restore: {str(e)}")
            return {"success": False, "message": str(e)}

    async def toggle_controller(self, disable: bool):
        """Manual toggle via UI buttons."""
        action = "disable" if disable else "enable"
        script_path = os.path.join(self.PLUGIN_DIR, "disable_steam_input.sh")
        
        self.log(f"Manual action: {action} called.")
        
        try:
            process = subprocess.Popen(
                ["sudo", script_path, action],
                env=self.get_clean_env(),
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )
            stdout, stderr = process.communicate()
            
            if process.returncode == 0:
                msg = "Controller deactivated" if disable else "Controller activated"
                return {"success": True, "message": msg}
            else:
                self.log(f"Toggle error: {stderr}")
                return {"success": False, "message": "Action failed. Check logs."}
        except Exception as e:
            return {"success": False, "message": str(e)}

    async def _main(self):
        self.log("Backend loaded and ready.")

    async def _unload(self):
        self.log("Backend shut down.")
