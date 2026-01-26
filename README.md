# ControllerPriority (Decky Plugin)

# Support
Hey if you like what I did with this, :beers: or a :pizza: would be nice :D

[![coffee](https://www.buymeacoffee.com/assets/img/custom_images/black_img.png)](https://buymeacoffee.com/fgod)

---

**ControllerPriority** is a Decky Loader plugin for the Steam Deck that allows you to easily disable the internal Steam Deck controller. This ensures that an external controller (like a PS5, Xbox, or Switch Pro controller) is always recognized as "Player 1" when docked.

## Features

* **Udev Rule Management**: Install or uninstall a system rule that automatically disables the internal controller when an external one is connected.
* **Live Session Toggle**: Manually enable or disable the internal controller on-the-fly without needing a reboot.
* **Auto-Polling**: The UI updates in real-time (every 2 seconds) to reflect the actual state of the controller.
* **Safety Lock**: To prevent getting locked out, the "Live Control" toggle is disabled unless the udev safety rules are installed.
* **Steam Deck Compatibility**: Works with both `1-1` and `3-3` USB bus revisions.

## Installation

1.  Ensure you have [Decky Loader](https://github.com/SteamDeckHomebrew/decky-loader) installed.
2. Download the `ControllerPriority.zip` from the [Releases](#) page.
3. Move the ZIP to `/home/deck/homebrew/plugins/`.
4. Unzip the file so that the folder `ControllerPriority` is inside the `plugins` directory.
5. Restart your Steam Deck or run `sudo systemctl restart plugin_loader.service` in terminal.

## Usage

1.  Open the Decky menu and select **ControllerPriority**.
2.  Click **Install Udev Rules**. You will be prompted for your `sudo` password.
3.  The plugin will now automatically manage the controller priority.
4.  If you need to override the state for the current session, use the **Live Control** toggle.

## Credits & Acknowledgments

This plugin is a graphical implementation and extension of the work by **scawp**. The core udev rules and logic for disabling the Steam Deck controller are based on his original scripts.

* **Original Project:** [Steam-Deck.Auto-Disable-Steam-Controller](https://github.com/scawp/Steam-Deck.Auto-Disable-Steam-Controller) by [scawp](https://github.com/scawp)

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.
