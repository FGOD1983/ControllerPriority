import os
import datetime
import glob
import asyncio

class Plugin:
    PLUGIN_DIR = os.path.dirname(os.path.realpath(__file__))
    LOG_FILE = "/tmp/controller-priority.log"
    # We houden de vorige staat bij in de klasse zelf
    last_external_count = 0

    def log(self, msg: str):
        try:
            timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            with open(self.LOG_FILE, "a") as f:
                f.write(f"{timestamp} - {msg}\n")
        except: pass

    def is_controller(self, dev_id):
        dev_path = f"/sys/bus/usb/devices/{dev_id}"
        product_file = os.path.join(dev_path, "product")
        if not os.path.exists(product_file): return False
        try:
            with open(product_file, "r") as f:
                product_name = f.read().strip().lower()
            blacklist = ["hub", "lan", "radio", "storage", "ethernet", "bluetooth"]
            if any(x in product_name for x in blacklist): return False
            class_files = glob.glob(f"{dev_path}/{dev_id}:*/bInterfaceClass")
            for cf in class_files:
                with open(cf, "r") as f:
                    if f.read().strip().lower() in ["03", "3", "ff"]: return True
        except: pass
        return False

    async def check_bind_status(self):
        return os.path.exists("/sys/bus/usb/devices/3-3:1.0/driver")

    async def get_external_controllers(self):
        controllers = []
        usb_bus_path = "/sys/bus/usb/devices/"
        any_external_active = False 
        
        try:
            for dev_id in os.listdir(usb_bus_path):
                if ":" in dev_id or dev_id.startswith("usb") or dev_id == "3-3": continue
                
                if self.is_controller(dev_id):
                    dev_path = os.path.join(usb_bus_path, dev_id)
                    with open(os.path.join(dev_path, "product"), "r") as f:
                        name = f.read().strip()
                    
                    is_bound = len(glob.glob(f"{dev_path}/{dev_id}:*/driver")) > 0
                    if is_bound:
                        any_external_active = True
                        
                    controllers.append({"id": dev_id, "name": name, "is_bound": is_bound})

            current_count = len([c for c in controllers if c['is_bound']])
            internal_is_bound = await self.check_bind_status()

            # --- FULL AUTO-SWITCH LOGIC ---
            
            # TRIGGER: 0 -> 1 (Eerste controller verbonden)
            if self.last_external_count == 0 and current_count >= 1:
                if internal_is_bound:
                    self.log("AUTO-SWITCH: External detected. Disabling internal pad.")
                    await self.toggle_controller(True, "internal")

            # TRIGGER: x -> 0 (Laatste controller weg/Hub los)
            elif self.last_external_count > 0 and current_count == 0:
                if not internal_is_bound:
                    self.log("AUTO-SWITCH: No externals left. Re-enabling internal pad.")
                    await self.toggle_controller(False, "internal")

            # Update de staat voor de volgende poll
            self.last_external_count = current_count

        except Exception as e: 
            self.log(f"Scan error: {str(e)}")
            
        return controllers

    async def toggle_controller(self, disable: bool, target_id: str = "internal"):
        action = "unbind" if disable else "bind"
        base_id = "3-3" if target_id == "internal" else target_id
        target_ids = [os.path.basename(x) for x in glob.glob(f"/sys/bus/usb/devices/{base_id}:*")]
        
        for dev_id in target_ids:
            for driver in ["usbhid", "xpad", "hid-generic"]:
                path = f"/sys/bus/usb/drivers/{driver}/{action}"
                if os.path.exists(path):
                    try:
                        with open(path, "w") as f: 
                            f.write(dev_id)
                    except: pass
        await asyncio.sleep(0.5)
        return True

    async def _main(self): pass
    async def _unload(self): pass
