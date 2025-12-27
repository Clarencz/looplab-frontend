import { useState } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import { useNavigate } from "react-router-dom"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Keyboard } from "lucide-react"

const shortcuts = [
    { keys: "Ctrl+K, Cmd+K", description: "Open command palette", action: "command-palette" },
    { keys: "Ctrl+S, Cmd+S", description: "Save workspace", action: "save" },
    { keys: "Ctrl+/, Cmd+/", description: "Toggle file panel", action: "toggle-panel" },
    { keys: "?", description: "Show keyboard shortcuts", action: "help" },
    { keys: "Ctrl+B, Cmd+B", description: "Toggle sidebar", action: "toggle-sidebar" },
    { keys: "Esc", description: "Close modals/dialogs", action: "escape" },
]

export const KeyboardShortcutsModal = () => {
    const [open, setOpen] = useState(false)
    const navigate = useNavigate()

    // Show shortcuts modal
    useHotkeys("shift+?", (e) => {
        e.preventDefault()
        setOpen(true)
    })

    // Save workspace (Ctrl+S / Cmd+S)
    useHotkeys("ctrl+s, meta+s", (e) => {
        e.preventDefault()
        // Trigger save action (will be implemented when backend is ready)
        console.log("Save triggered")
    })

    // Toggle file panel (Ctrl+/ / Cmd+/)
    useHotkeys("ctrl+/, meta+/", (e) => {
        e.preventDefault()
        // Dispatch custom event for file panel toggle
        window.dispatchEvent(new CustomEvent("toggle-file-panel"))
    })

    // Navigate home (Ctrl+H / Cmd+H)
    useHotkeys("ctrl+h, meta+h", (e) => {
        e.preventDefault()
        navigate("/dashboard")
    })

    const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0

    const formatKeys = (keys: string) => {
        if (isMac) {
            return keys.split(", ")[1] || keys.split(", ")[0]
        }
        return keys.split(", ")[0]
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Keyboard className="w-5 h-5" />
                        Keyboard Shortcuts
                    </DialogTitle>
                    <DialogDescription>Use these shortcuts to navigate faster</DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {shortcuts.map((shortcut, index) => (
                        <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                            <span className="text-sm text-foreground">{shortcut.description}</span>
                            <kbd className="px-3 py-1.5 text-xs font-mono bg-muted rounded border border-border">
                                {formatKeys(shortcut.keys)}
                            </kbd>
                        </div>
                    ))}
                </div>

                <div className="text-xs text-muted-foreground mt-4">
                    Press <kbd className="px-2 py-1 bg-muted rounded border border-border">Shift</kbd> +{" "}
                    <kbd className="px-2 py-1 bg-muted rounded border border-border">?</kbd> to show this dialog anytime
                </div>
            </DialogContent>
        </Dialog>
    )
}
