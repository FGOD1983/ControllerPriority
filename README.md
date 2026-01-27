# ControllerPriority (Decky Plugin)

# Support
Hey if you like what I did with this, :beers: or a :pizza: would be nice :D

[![coffee](https://www.buymeacoffee.com/assets/img/custom_images/black_img.png)](https://buymeacoffee.com/fgod)

---

**ControllerPriority** is a Decky Loader plugin for the Steam Deck that automatically manages your controller order. It ensures that an external controller (like a PS5, Xbox, or Switch Pro controller) is always recognized as **Player 1** by hiding the internal Steam Deck controller the moment an external one is connected.

## Features

* **Zero-Config Automation**: Works out of the box. No sudo passwords or complex setup required.
* **Hybrid Connectivity**: 
    * **USB Support**: Intelligent port-tracking. Even if you "unbind" a USB controller, the plugin remembers it until you physically unplug the dongle or dock.
    * **Bluetooth Support**: Advanced MAC-address matching. Seamlessly disconnects controllers by talking directly to the Linux Bluetooth stack (`bluez`), bypassing common ID mismatch issues.
* **Smart Auto-Switch (Background Service)**: 
    * **0 → 1**: Connect your first external controller (USB or BT), and the internal pad is automatically hidden.
    * **x → 0**: Disconnect all controllers (or unplug your dock), and the internal pad is instantly restored for safety.
    * **Always Active**: The auto-switch logic runs in a persistent background loop, working even when you are in-game or the plugin menu is closed.
* **Safety Safeguards**: The UI intelligently prevents you from hiding the internal controller if no other active controller is detected, ensuring you are never left without a way to control your Deck.
* **Driver-Level Control**: Uses native Linux kernel `bind/unbind` for USB and `bluetoothctl` for wireless, leaving no "junk" files or permanent udev rules on your SteamOS partition.

## Installation

1. Ensure you have [Decky Loader](https://github.com/SteamDeckHomebrew/decky-loader) installed.
2. Download the latest release of `ControllerPriority`.
3. Move the `ControllerPriority` folder to `~/homebrew/plugins/`.
4. Restart your Steam Deck or refresh the plugin loader.

## Usage

1. Open the Decky menu and select **ControllerPriority**.
2. **Automatic Mode**: The plugin will automatically hide the internal pad whenever an external controller is connected.
3. **Manual Control**: 
    * Use the **Internal: ACTIVE/HIDDEN** toggle to manually override the Steam Deck's built-in controls.
    * Use the **Connect/Disconnect** buttons for individual external controllers to manage your session.

> **Note**: This plugin no longer requires udev rules. If you used a previous udev-based solution, you can safely clean it up by running:  
> `sudo rm /etc/udev/rules.d/99-disable-steam-input.rules`

## Credits & Acknowledgments

This plugin evolved from the udev-based concepts by **scawp**, but has been completely rewritten to use a native Python backend and a background service for a seamless, password-free experience.

* **Inspired by:** [Steam-Deck.Auto-Disable-Steam-Controller](https://github.com/scawp/Steam-Deck.Auto-Disable-Steam-Controller) by [scawp](https://github.com/scawp)

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.
