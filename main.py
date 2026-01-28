import os
import re
import asyncio
import logging

# Configuration
INPUT_DEVICES = "/proc/bus/input/devices"
INTERNAL_USB_ID = "3-3"
USB_DRIVER_PATH = "/sys/bus/usb/drivers/usb"
USB_DEVICES_ROOT = "/sys/bus/usb/devices"

class Plugin:
    last_external_count = -1
    is_processing = False
    tracked_usb_devices = {} 
    tracked_bt_devices = {}  
    _monitor_task = None

    async def _listen_for_sleep(self):
        """Monitor system sleep/resume signals via DBUS."""
        logging.info("ControllerPriority: DBUS Sleep Monitor started.")
        try:
            proc = await asyncio.create_subprocess_exec(
                "dbus-monitor", "--system", "type='signal',interface='org.freedesktop.login1.Manager',member='PrepareForSleep'",
                stdout=asyncio.subprocess.PIPE
            )
            while True:
                line = await proc.stdout.readline()
                if not line: break
                if b"boolean true" in line:
                    logging.info("ControllerPriority: DBUS signal - System SUSPENDING. Restoring internal controls...")
                    await self.toggle_controller(False, "internal")
                elif b"boolean false" in line:
                    logging.info("ControllerPriority: DBUS signal - System RESUMING. Resetting state...")
                    self.last_external_count = -1
                    await self.toggle_controller(False, "internal")
                    os.system("udevadm trigger")
        except asyncio.CancelledError:
            logging.info("ControllerPriority: DBUS Monitor stopped.")
        except Exception as e:
            logging.error(f"ControllerPriority: DBUS Monitor Error: {e}")

    async def _get_bluetooth_status(self):
        connected_macs = []
        paired_map = {}
        try:
            proc_p = await asyncio.create_subprocess_exec("bluetoothctl", "devices", stdout=asyncio.subprocess.PIPE)
            out_p, _ = await proc_p.communicate()
            for line in out_p.decode().split('\n'):
                if "Device" in line:
                    parts = line.split(' ', 2)
                    if len(parts) >= 3:
                        paired_map[parts[1].strip()] = parts[2].strip()

            proc_c = await asyncio.create_subprocess_exec("bluetoothctl", "devices", "Connected", stdout=asyncio.subprocess.PIPE)
            out_c, _ = await proc_c.communicate()
            for line in out_c.decode().split('\n'):
                if "Device" in line:
                    parts = line.split(' ', 2)
                    if len(parts) >= 2:
                        connected_macs.append(parts[1].strip())
        except: pass
        return connected_macs, paired_map

    async def get_external_controllers(self):
        current_list = []
        bt_connected, bt_paired = await self._get_bluetooth_status()
        
        blocks = []
        if os.path.exists(INPUT_DEVICES):
            with open(INPUT_DEVICES, "r") as f:
                blocks = f.read().split("\n\n")

        active_now_ids = []
        for block in blocks:
            if "EV=20000b" not in block or INTERNAL_USB_ID in block:
                continue
            
            name_match = re.search(r'N: Name="([^"]+)"', block)
            bus_match = re.search(r'I: .*Bus=([0-9a-fA-F]+)', block)
            sysfs_match = re.search(r'S: Sysfs=(.*)', block)
            
            if not name_match or not bus_match: continue
            name, bus = name_match.group(1), bus_match.group(1).lower()

            if bus == "0005":
                for mac, p_name in bt_paired.items():
                    if p_name == name and mac in bt_connected:
                        self.tracked_bt_devices[mac] = name
                        current_list.append({"id": mac, "name": name, "type": "Bluetooth", "is_bound": True})
                        active_now_ids.append(mac)
                        break
            
            elif bus == "0003" and sysfs_match:
                usb_match = re.search(r'/([0-9.-]+):\d+\.\d+', sysfs_match.group(1))
                if usb_match:
                    usb_id = usb_match.group(1)
                    self.tracked_usb_devices[usb_id] = name
                    current_list.append({"id": usb_id, "name": name, "type": "USB", "is_bound": True})
                    active_now_ids.append(usb_id)

        for usb_id, name in list(self.tracked_usb_devices.items()):
            if usb_id not in active_now_ids:
                if os.path.exists(f"{USB_DEVICES_ROOT}/{usb_id}"):
                    current_list.append({"id": usb_id, "name": name, "type": "USB", "is_bound": False})
                else: del self.tracked_usb_devices[usb_id]

        for mac, name in list(self.tracked_bt_devices.items()):
            if mac not in active_now_ids:
                if mac in bt_paired:
                    current_list.append({"id": mac, "name": name, "type": "Bluetooth", "is_bound": False})
                else: del self.tracked_bt_devices[mac]

        return current_list

    async def toggle_controller(self, current_status: bool, target_id: str):
        if self.is_processing: return False
        self.is_processing = True
        try:
            if ":" in target_id and "-" not in target_id:
                cmd = "disconnect" if current_status else "connect"
                await asyncio.create_subprocess_exec("bluetoothctl", cmd, target_id)
                await asyncio.sleep(1.5)
                return True
            
            usb_id = INTERNAL_USB_ID if target_id == "internal" else target_id
            action = "unbind" if current_status else "bind"
            path = f"{USB_DRIVER_PATH}/{action}"
            
            if os.path.exists(path):
                is_bound = os.path.exists(f"{USB_DEVICES_ROOT}/{usb_id}/driver")
                if (action == "bind" and not is_bound) or (action == "unbind" and is_bound):
                    with open(path, "w") as f: f.write(usb_id)
            return True
        finally:
            self.is_processing = False

    async def check_bind_status(self):
        return os.path.exists(f"{USB_DEVICES_ROOT}/{INTERNAL_USB_ID}/driver")

    async def _unload(self):
        """Clean up when plugin is disabled or reloaded."""
        if self._monitor_task:
            self._monitor_task.cancel()

    async def _main(self):
        self._monitor_task = asyncio.create_task(self._listen_for_sleep())
        
        while True:
            try:
                ctrls = await self.get_external_controllers()
                active_ext_count = len([c for c in ctrls if c["is_bound"]])
                is_internal_alive = await self.check_bind_status()

                if self.last_external_count != -1:
                    if self.last_external_count == 0 and active_ext_count > 0:
                        if is_internal_alive: 
                            logging.info("ControllerPriority: External controller connected. Disabling internal.")
                            await self.toggle_controller(True, "internal")
                    elif self.last_external_count > 0 and active_ext_count == 0:
                        if not is_internal_alive: 
                            logging.info("ControllerPriority: No external controllers. Restoring internal.")
                            await self.toggle_controller(False, "internal")

                self.last_external_count = active_ext_count
            except Exception as e:
                logging.error(f"ControllerPriority: Loop Error: {e}")
            
            await asyncio.sleep(1)
