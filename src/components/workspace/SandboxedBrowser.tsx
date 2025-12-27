"use client"

import { useState } from "react"
import { RefreshCw, Maximize2, Minimize2, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface SandboxedBrowserProps {
  url: string
  isExpanded: boolean
  onToggleExpand: () => void
  previewContent?: string
}

const SandboxedBrowser = ({ url, isExpanded, onToggleExpand, previewContent }: SandboxedBrowserProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [currentUrl, setCurrentUrl] = useState(url)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 500)
  }

  return (
    <div className="h-full bg-card flex flex-col">
      {/* Browser toolbar */}
      <div className="h-10 bg-card border-b border-border flex items-center gap-2 px-2 shrink-0">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleRefresh} disabled={isRefreshing}>
          <RefreshCw className={cn("w-3.5 h-3.5", isRefreshing && "animate-spin")} />
        </Button>

        <div className="flex-1">
          <Input
            value={currentUrl}
            onChange={(e) => setCurrentUrl(e.target.value)}
            className="h-7 text-xs font-mono bg-secondary border-0"
            readOnly
          />
        </div>

        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onToggleExpand}>
          {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </Button>

        <Button variant="ghost" size="icon" className="h-7 w-7">
          <ExternalLink className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Browser content */}
      <div className="flex-1 bg-white overflow-auto">
        {previewContent ? (
          <iframe srcDoc={previewContent} className="w-full h-full border-0" title="Preview" sandbox="allow-scripts" />
        ) : (
          <div className="h-full flex items-center justify-center bg-secondary/10">
            <div className="text-center text-muted-foreground">
              <p className="font-mono text-sm">Preview will appear here</p>
              <p className="text-xs mt-1">Run the project to see the output</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Need to import cn
import { cn } from "@/lib/utils"

export default SandboxedBrowser
