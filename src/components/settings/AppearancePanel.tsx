"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Check, Sun, Moon, Monitor } from "lucide-react"

interface Theme {
  id: string
  name: string
  icon?: React.ReactNode
  preview: {
    bg: string
    text: string
    card: string
    accent: string
  }
}

interface EditorTheme {
  id: string
  name: string
  preview: {
    bg: string
    keyword: string
    string: string
    comment: string
  }
}

const appThemes: Theme[] = [
  {
    id: "light",
    name: "Light",
    icon: <Sun className="h-4 w-4" />,
    preview: { bg: "#ffffff", text: "#0f172a", card: "#f8fafc", accent: "#3b82f6" },
  },
  {
    id: "dark",
    name: "Dark",
    icon: <Moon className="h-4 w-4" />,
    preview: { bg: "#0f172a", text: "#f8fafc", card: "#1e293b", accent: "#3b82f6" },
  },
  {
    id: "midnight",
    name: "Midnight Blue",
    preview: { bg: "#0a1628", text: "#e2e8f0", card: "#132743", accent: "#60a5fa" },
  },
  {
    id: "solarized",
    name: "Solarized",
    preview: { bg: "#002b36", text: "#839496", card: "#073642", accent: "#b58900" },
  },
  {
    id: "system",
    name: "System Default",
    icon: <Monitor className="h-4 w-4" />,
    preview: { bg: "#f8fafc", text: "#0f172a", card: "#ffffff", accent: "#3b82f6" },
  },
]

const editorThemes: EditorTheme[] = [
  {
    id: "monokai",
    name: "Monokai",
    preview: { bg: "#272822", keyword: "#f92672", string: "#e6db74", comment: "#75715e" },
  },
  {
    id: "dracula",
    name: "Dracula",
    preview: { bg: "#282a36", keyword: "#ff79c6", string: "#f1fa8c", comment: "#6272a4" },
  },
  {
    id: "github-light",
    name: "GitHub Light",
    preview: { bg: "#ffffff", keyword: "#d73a49", string: "#032f62", comment: "#6a737d" },
  },
  {
    id: "github-dark",
    name: "GitHub Dark",
    preview: { bg: "#0d1117", keyword: "#ff7b72", string: "#a5d6ff", comment: "#8b949e" },
  },
  {
    id: "solarized-dark",
    name: "Solarized Dark",
    preview: { bg: "#002b36", keyword: "#859900", string: "#2aa198", comment: "#586e75" },
  },
  {
    id: "tomorrow",
    name: "Tomorrow",
    preview: { bg: "#1d1f21", keyword: "#cc6666", string: "#b5bd68", comment: "#969896" },
  },
]

export function AppearancePanel() {
  const [selectedTheme, setSelectedTheme] = useState("dark")
  const [selectedEditorTheme, setSelectedEditorTheme] = useState("monokai")

  return (
    <div className="space-y-6">
      {/* App Theme */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Theme</CardTitle>
          <CardDescription>Choose how LoopLab looks to you</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {appThemes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setSelectedTheme(theme.id)}
                className={cn(
                  "relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200",
                  selectedTheme === theme.id
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-border hover:border-muted-foreground/30",
                )}
              >
                {/* Theme Preview */}
                <div
                  className="w-full aspect-[4/3] rounded-lg overflow-hidden border border-border/50"
                  style={{ backgroundColor: theme.preview.bg }}
                >
                  <div className="p-2 space-y-1.5">
                    <div className="h-1.5 w-8 rounded" style={{ backgroundColor: theme.preview.text }} />
                    <div className="h-6 w-full rounded" style={{ backgroundColor: theme.preview.card }} />
                    <div className="flex gap-1">
                      <div className="h-2 w-6 rounded" style={{ backgroundColor: theme.preview.accent }} />
                      <div className="h-2 w-4 rounded" style={{ backgroundColor: theme.preview.text, opacity: 0.3 }} />
                    </div>
                  </div>
                </div>

                {/* Theme Name */}
                <div className="flex items-center gap-1.5 text-sm font-medium">
                  {theme.icon}
                  <span>{theme.name}</span>
                </div>

                {/* Selected Indicator */}
                {selectedTheme === theme.id && (
                  <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                    <Check className="h-3 w-3 text-primary-foreground" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Editor Theme */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Editor Theme</CardTitle>
          <CardDescription>Customize the code editor appearance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {editorThemes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setSelectedEditorTheme(theme.id)}
                className={cn(
                  "relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200",
                  selectedEditorTheme === theme.id
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-border hover:border-muted-foreground/30",
                )}
              >
                {/* Editor Preview */}
                <div
                  className="w-full aspect-[4/3] rounded-lg overflow-hidden font-mono text-[8px] p-2"
                  style={{ backgroundColor: theme.preview.bg }}
                >
                  <div style={{ color: theme.preview.keyword }}>const</div>
                  <div style={{ color: theme.preview.string }}>"hello"</div>
                  <div style={{ color: theme.preview.comment }}>// code</div>
                </div>

                {/* Theme Name */}
                <span className="text-sm font-medium">{theme.name}</span>

                {/* Selected Indicator */}
                {selectedEditorTheme === theme.id && (
                  <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                    <Check className="h-3 w-3 text-primary-foreground" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
