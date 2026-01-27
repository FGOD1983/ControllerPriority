import os
import re
import asyncio
import subprocess

INPUT_DEVICES = "/proc/bus/input/devices"
INTERNAL_USB_ID = "3-3"
USB_DRIVER_PATH = "/sys/bus/usb/drivers/usb"
USB_DEVICES_ROOT = "/sys/bus/usb/devices"

class Plugin:
    last_external_count = -1
    is_processing = False
    tracked_usb_devices = {}

    async def _get_bluetooth_mappings(self):
        mappings = {}
        try:
            proc = await asyncio.create_subprocess_exec(
                "bluetoothctl", "devices", "Connected",
                stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE
            )
            stdout, _ = await proc.communicate()
            for line in stdout.decode().split('\n'):
                if "Device" in line:
                    parts = line.split(' ', 2)
                    if len(parts) >= 3:
                        mappings[parts[2].strip()] = parts[1].strip()
        except:
            pass
        return mappings

    def _parse_input_devices(self):
        try:
            if not os.path.exists(INPUT_DEVICES): return []
            with open(INPUT_DEVICES, "r") as f:
                return f.read().split("\n\n")
        except:
            return []

    async def get_external_controllers(self):
        """Wordt aangeroepen door de UI (Frontend)"""
        current_external_list = []
        bt_mappings = await self._get_bluetooth_mappings()
        blocks = self._parse_input_devices()
        
        for block in blocks:
            if "EV=20000b" not in block or "/devices/virtual/input/" in block or INTERNAL_USB_ID in block or "(IMU)" in block:
                continue

            name_match = re.search(r'N: Name="([^"]+)"', block)
            bus_match = re.search(r'I: .*Bus=([0-9a-fA-F]+)', block)
            sysfs_match = re.search(r'S: Sysfs=(.*)', block)

            if not name_match or not bus_match: continue
            name, bus = name_match.group(1), bus_match.group(1).lower()

            if bus == "0005": # BT
                real_mac = bt_mappings.get(name)
                if real_mac:
                    current_external_list.append({"id": real_mac, "name": name, "type": "Bluetooth", "is_bound": True})
            elif bus == "0003": # USB
                usb_match = re.search(r'/([0-9.-]+):\d+\.\d+', sysfs_match.group(1) if sysfs_match else "")
                if usb_match:
                    usb_id = usb_match.group(1)
                    self.tracked_usb_devices[usb_id] = name
                    current_external_list.append({"id": usb_id, "name": name, "type": "USB", "is_bound": True})

        # USB Unbound logic
        for usb_id, name in list(self.tracked_usb_devices.items()):
            dev_path = f"{USB_DEVICES_ROOT}/{usb_id}"
            if os.path.exists(dev_path):
                if not os.path.exists(f"{dev_path}/driver"):
                    if not any(c['id'] == usb_id for c in current_external_list):
                        current_external_list.append({"id": usb_id, "name": name, "type": "USB", "is_bound": False})
            else:
                del self.tracked_usb_devices[usb_id]

        return current_external_list

    async def toggle_controller(self, current_status: bool, target_id: str):
        if self.is_processing: return False
        self.is_processing = True
        try:
            if ":" in target_id and "-" not in target_id: # BT
                if current_status:
                    await asyncio.create_subprocess_exec("bluetoothctl", "disconnect", target_id)
                    await asyncio.sleep(1.0)
                return True

            usb_id = INTERNAL_USB_ID if target_id == "internal" else target_id
            action = "unbind" if current_status else "bind"
            path = f"{USB_DRIVER_PATH}/{action}"
            if os.path.exists(path):
                with open(path, "w") as f: f.write(usb_id)
                await asyncio.sleep(0.5)
            return True
        finally:
            self.is_processing = False

    async def check_bind_status(self):
        return os.path.exists(f"{USB_DEVICES_ROOT}/{INTERNAL_USB_ID}/driver")

    async def _main(self):
        """DEZE LOOP DRAAIT ALTIJD OP DE ACHTERGROND"""
        while True:
            try:
                # Scan controllers zonder de UI nodig te hebben
                ctrls = await self.get_external_controllers()
                is_internal_alive = await self.check_bind_status()
                active_ext_count = len([c for c in ctrls if c["is_bound"]])

                if self.last_external_count != -1:
                    # Logica: Iets aangesloten -> Intern UIT
                    if self.last_external_count == 0 and active_ext_count > 0:
                        if is_internal_alive:
                            await self.toggle_controller(True, "internal")
                    
                    # Logica: Alles losgekoppeld -> Intern AAN
                    elif self.last_external_count > 0 and active_ext_count == 0:
                        if not is_internal_alive:
                            await self.toggle_controller(False, "internal")

                self.last_external_count = active_ext_count
            except Exception as e:
                print(f"Background error: {e}")
            
            await asyncio.sleep(2) # Check elke 2 seconden
