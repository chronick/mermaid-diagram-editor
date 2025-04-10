"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Share, Download, HelpCircle, Copy, Check } from "lucide-react"
import { diagramTemplates } from "@/lib/constants"

interface ToolbarProps {
  theme: string
  onThemeChange: (theme: string) => void
  generateShareUrl: () => string
  diagramCode: string
}

export default function Toolbar({ theme, onThemeChange, generateShareUrl, diagramCode }: ToolbarProps) {
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [helpDialogOpen, setHelpDialogOpen] = useState(false)
  const [shareUrl, setShareUrl] = useState("")
  const [copied, setCopied] = useState(false)

  const handleShare = () => {
    // Generate a fresh URL to ensure it has the latest data
    const url = generateShareUrl()
    setShareUrl(url)
    setShareDialogOpen(true)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy URL", err)
    }
  }

  const exportSVG = () => {
    const svgElement = document.querySelector("svg")
    if (!svgElement) return

    const svgData = new XMLSerializer().serializeToString(svgElement)
    const blob = new Blob([svgData], { type: "image/svg+xml" })
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.download = "diagram.svg"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const exportPNG = async () => {
    const svgElement = document.querySelector("svg")
    if (!svgElement) return

    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const svgData = new XMLSerializer().serializeToString(svgElement)
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = "data:image/svg+xml;base64," + btoa(svgData)

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)

      const link = document.createElement("a")
      link.download = "diagram.png"
      link.href = canvas.toDataURL("image/png")
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div className="flex items-center justify-between p-2 border-b border-border bg-card">
      <div className="flex items-center space-x-2">
        <h1 className="text-xl font-bold">Mermaid Diagram Editor</h1>
        <Select value={theme} onValueChange={onThemeChange}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="forest">Forest</SelectItem>
            <SelectItem value="neutral">Neutral</SelectItem>
          </SelectContent>
        </Select>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Templates</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {Object.entries(diagramTemplates).map(([key, template]) => (
              <DropdownMenuItem key={key} onClick={() => (window.location.href = `/?data=${template}`)}>
                {key}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center space-x-2">
        <Button variant="outline" onClick={() => setHelpDialogOpen(true)}>
          <HelpCircle className="h-4 w-4 mr-2" />
          Help
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={exportSVG}>SVG</DropdownMenuItem>
            <DropdownMenuItem onClick={exportPNG}>PNG</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button onClick={handleShare}>
          <Share className="h-4 w-4 mr-2" />
          Share
        </Button>
      </div>

      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Diagram</DialogTitle>
            <DialogDescription>Copy this URL to share your diagram with others</DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <Input value={shareUrl} readOnly />
            <Button size="icon" onClick={copyToClipboard}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={helpDialogOpen} onOpenChange={setHelpDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Mermaid Diagram Help</DialogTitle>
            <DialogDescription>Learn how to create diagrams with Mermaid syntax</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            <div>
              <h3 className="text-lg font-medium">Sequence Diagram</h3>
              <pre className="bg-muted p-2 rounded-md text-sm">
                {`sequenceDiagram
  participant Alice
  participant Bob
  Alice->>Bob: Hello Bob, how are you?
  Bob-->>Alice: I'm good thanks!`}
              </pre>
            </div>
            <div>
              <h3 className="text-lg font-medium">Flowchart</h3>
              <pre className="bg-muted p-2 rounded-md text-sm">
                {`flowchart TD
  A[Start] --> B{Is it?}
  B -->|Yes| C[OK]
  C --> D[Rethink]
  D --> B
  B ---->|No| E[End]`}
              </pre>
            </div>
            <div>
              <h3 className="text-lg font-medium">Class Diagram</h3>
              <pre className="bg-muted p-2 rounded-md text-sm">
                {`classDiagram
  Animal <|-- Duck
  Animal <|-- Fish
  Animal <|-- Zebra
  Animal : +int age
  Animal : +String gender
  Animal: +isMammal()
  Animal: +mate()
  class Duck{
    +String beakColor
    +swim()
    +quack()
  }`}
              </pre>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
