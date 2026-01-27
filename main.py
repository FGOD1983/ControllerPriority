import os
import re
import glob
import asyncio

INPUT_DEVICES = "/proc/bus/input/devices"
INTERNAL_USB_PATH = "/sys/bus/usb/devices/3-3:1.0/driver"

class Plugin:
    # last_external_count op -1 zorgt dat de eerste scan de huidige situatie 'leert'
    last_external_count = -1
    is_processing = False

    # ---------- DETECTION LOGIC ----------
    def _parse_input_devices(self):
        try:
            with open(INPUT_DEVICES, "r") as f:
                return f.read().split("\n\n")
        except:
            return []

    def _is_external_controller(self, block: str) -> bool:
        if "EV=20000b" not in block: return False
        if "/devices/virtual/input/" in block: return False
        if 'Name="Microsoft X-Box 360 pad' in block: return False
        return True

    def _extract_controller_info(self, block: str):
        name_match = re.search(r'N: Name="([^"]+)"', block)
        bus_match = re.search(r'I: .*Bus=([0-9a-fA-F]+)', block)
        phys_match = re.search(r'P: Phys=(.*)', block)
        if not name_match or not bus_match: return None
        
        bus = bus_match.group(1)
        return {
            "id": phys_match.group(1).strip() if phys_match else name_match.group(1),
            "name": name_match.group(1),
            "type": "Bluetooth" if bus == "0005" else "USB",
            "is_bound": True
        }

    async def get_external_controllers(self):
        controllers = []
        try:
            # 1. Scan huidige controllers
            for block in self._parse_input_devices():
                if self._is_external_controller(block):
                    info = self._extract_controller_info(block)
                    if info: controllers.append(info)

            current_count = len(controllers)

            # 2. AUTO-SWITCH TRIGGER LOGICA
            if self.last_external_count != -1:
                # TRIGGER: Eerste externe controller aangesloten (0 -> 1+)
                if self.last_external_count == 0 and current_count > 0:
                    is_active = await self.check_bind_status()
                    if is_active:
                        asyncio.create_task(self.toggle_controller(True, "internal"))
                
                # TRIGGER: Laatste externe controller losgekoppeld (1+ -> 0)
                elif self.last_external_count > 0 and current_count == 0:
                    is_active = await self.check_bind_status()
                    if not is_active:
                        asyncio.create_task(self.toggle_controller(False, "internal"))

            # Update count voor vergelijking bij de volgende scan
            self.last_external_count = current_count

        except Exception as e:
            print(f"Detection Error: {e}")
            
        return controllers

    # ---------- USB COMMANDS ----------
    async def toggle_controller(self, current_status: bool, target_id: str = "internal"):
        if self.is_processing: return
        self.is_processing = True
        
        # Als current_status (isBound) True is -> unbinden
        action = "unbind" if current_status else "bind"
        
        try:
            for dev_path in glob.glob("/sys/bus/usb/devices/3-3:*"):
                dev_id = os.path.basename(dev_path)
                for driver in ["usbhid", "hid-steam", "xpad", "hid-generic"]:
                    path = f"/sys/bus/usb/drivers/{driver}/{action}"
                    if os.path.exists(path):
                        try:
                            with open(path, "w") as f:
                                f.write(dev_id)
                        except:
                            pass 
            await asyncio.sleep(0.8)
        finally:
            self.is_processing = False
        return True

    async def check_bind_status(self):
        return os.path.exists(INTERNAL_USB_PATH)

    async def _main(self):
        # Reset bij opstarten
        await self.toggle_controller(False, "internal")
