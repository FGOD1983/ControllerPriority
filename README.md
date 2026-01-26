# ControllerPriority (Decky Plugin)

# Support
Hey if you like what I did with this, :beers: or a :pizza: would be nice :D

[![coffee](https://www.buymeacoffee.com/assets/img/custom_images/black_img.png)](https://buymeacoffee.com/fgod)

---

**ControllerPriority** is a Decky Loader plugin for the Steam Deck that automatically manages your controller order. It ensures that an external controller (like a PS5, Xbox, or Switch Pro controller) is always recognized as **Player 1** by hiding the internal Steam Deck controller when you're docked or playing with friends.

## Features

* **Zero-Config Automation**: No more sudo passwords or complex setup. The plugin works out of the box without requiring root access.
* **Smart Auto-Switch**: 
    * **0 → 1**: Connect your first external controller, and the internal pad is automatically hidden.
    * **x → 0**: Unplug your controllers (or your dock/hub), and the internal pad is instantly restored for safety.
* **Driver-Level Control**: Uses native Linux kernel `bind/unbind` commands for a fast and clean toggle without leaving "junk" files or udev rules on your SteamOS partition.
* **Live Session Toggle**: Manually override the state at any time via the Decky menu.
* **Real-time Monitoring**: The UI and backend poll every 2 seconds to ensure your controls are always responsive, even when the hub is disconnected.

## Installation

1. Ensure you have [Decky Loader](https://github.com/SteamDeckHomebrew/decky-loader) installed.
2. Download the latest release of `ControllerPriority`.
3. Move the `ControllerPriority` folder to `~/homebrew/plugins/`.
4. Restart your Steam Deck or run `sudo systemctl restart plugin_loader.service` in the terminal.

## Usage

1. Open the Decky menu and select **ControllerPriority**.
2. **That's it!** The plugin will now automatically hide the internal pad whenever you connect an external controller.
3. If you want to use the internal pad alongside an external one, simply use the **Internal: ACTIVE** toggle in the menu to bring it back to life.

> **Note**: If you used a previous version of this plugin, you can safely remove the old udev rules by running:  
> `sudo rm /etc/udev/rules.d/99-disable-steam-input.rules`

## Credits & Acknowledgments

This plugin evolved from the udev-based concepts by **scawp**, but has been completely rewritten to use a native Python backend for a seamless, password-free experience.

* **Inspired by:** [Steam-Deck.Auto-Disable-Steam-Controller](https://github.com/scawp/Steam-Deck.Auto-Disable-Steam-Controller) by [scawp](https://github.com/scawp)

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.
