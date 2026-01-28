#!/bin/bash
# Wrapper script to run looplab-desktop outside of Snap environment
# This clears Snap-related environment variables that can cause GLIBC conflicts

# Unset Snap-related environment variables that interfere with library loading
unset SNAP_LIBRARY_PATH
unset GIO_MODULE_DIR
unset GTK_PATH
unset GTK_IM_MODULE_FILE
unset GDK_PIXBUF_MODULEDIR
unset GDK_PIXBUF_MODULE_FILE
unset LOCPATH
unset GSETTINGS_SCHEMA_DIR
unset GTK_EXE_PREFIX

# Reset XDG_DATA_DIRS to system default
export XDG_DATA_DIRS="/usr/local/share:/usr/share:/var/lib/snapd/desktop"

# Reset GIO_MODULE_DIR to system default
export GIO_MODULE_DIR="/usr/lib/x86_64-linux-gnu/gio/modules"

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Run the desktop application
exec "$SCRIPT_DIR/target/debug/looplab-desktop" "$@"
