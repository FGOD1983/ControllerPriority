#!/bin/bash
# Restore udev rules if they were removed by a SteamOS update
if [ ! -f /etc/udev/rules.d/99-disable-steam-input.rules ]; then
    echo "SteamOS update detected. Restoring udev rules..."
    sudo cp "/home/deck/.local/share/scawp/SDADSC/99-disable-steam-input.rules.bak" /etc/udev/rules.d/99-disable-steam-input.rules
    sudo udevadm control --reload
fi
