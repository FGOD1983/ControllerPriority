#!/bin/bash

# Bepaal het pad waar dit script staat
PLUGIN_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
TEMPLATE="$PLUGIN_DIR/99-disable-steam-input.rules.bak"
TARGET="/etc/udev/rules.d/99-disable-steam-input.rules"
# Het pad naar het daadwerkelijke disable-script
DISABLE_SCRIPT="$PLUGIN_DIR/disable_steam_input.sh"

# Kopieer de template en vervang {SCRIPT} door het echte pad mbv sed
sed "s|{SCRIPT}|$DISABLE_SCRIPT|g" "$TEMPLATE" > "$TARGET"

# Herlaad udev
udevadm control --reload
udevadm trigger
