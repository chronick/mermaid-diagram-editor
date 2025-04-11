"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Share, Download, HelpCircle, Copy, Check } from "lucide-react"
import HelpDialog from "@/components/help-dialog"
import ExamplesDropdown from "@/components/examples-dropdown"
import { ThemeToggle } from "@/components/theme-toggle"

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
    const svgElement = document.querySelector("svg#diagram")
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
    const svgElement = document.querySelector("svg#diagram")
    if (!svgElement) {
      console.error("No diagram SVG found")
      return
    }

    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Get the SVG dimensions
    const svgRect = svgElement.getBoundingClientRect()
    
    // Scale factor for better quality
    const scale = 2
    canvas.width = svgRect.width * scale
    canvas.height = svgRect.height * scale
    
    // Scale the context to match
    ctx.scale(scale, scale)

    try {
      // Clean up the SVG string and properly encode it
      const svgData = new XMLSerializer().serializeToString(svgElement)
      const cleanedSvgData = encodeURIComponent(svgData
        .replace(/(\r\n|\n|\r)/gm, "") // Remove newlines
        .replace(/%20/g, " ") // Fix spaces
        .replace(/%3D/g, "=") // Fix equals signs
        .replace(/%22/g, "'") // Replace double quotes with single quotes
        .replace(/%3A/g, ":") // Fix colons
      )

      const img = new Image()
      img.crossOrigin = "anonymous"

      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
        img.src = `data:image/svg+xml;charset=utf-8,${cleanedSvgData}`
      })

      // Draw with proper dimensions
      ctx.drawImage(img, 0, 0, svgRect.width, svgRect.height)

      // Convert to PNG and download
      const pngData = canvas.toDataURL("image/png")
      const link = document.createElement("a")
      link.download = "diagram.png"
      link.href = pngData
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Failed to export PNG:", error)
    }
  }

  return (
    <div className="flex items-center justify-between p-2 border-b border-border bg-card">
      <div className="flex items-center space-x-3">
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

        <ExamplesDropdown theme={theme} />
        
        <ThemeToggle />
      </div>

      <div className="flex items-center space-x-3">
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

      <HelpDialog open={helpDialogOpen} onOpenChange={setHelpDialogOpen} />
    </div>
  )
}
