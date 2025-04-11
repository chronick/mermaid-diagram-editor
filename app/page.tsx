"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import DiagramEditor from "@/components/diagram-editor"
import DiagramRenderer from "@/components/diagram-renderer"
import Toolbar from "@/components/toolbar"
import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from "lz-string"
import { defaultDiagramCode } from "@/lib/constants"
import type { DiagramData } from "@/lib/types"
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "@/components/ui/resizable"

export default function Home() {
  const searchParams = useSearchParams()
  const [diagramCode, setDiagramCode] = useState<string>(defaultDiagramCode)
  const [mermaidTheme, setMermaidTheme] = useState<"base" | "default" | "dark" | "forest" | "neutral" | "null">("default")
  const [isInitialized, setIsInitialized] = useState(false)
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const skipNextUpdateRef = useRef(false)
  const [editorSize, setEditorSize] = useState(50) // Default 50% width
  const [isExpanded, setIsExpanded] = useState(false)

  // Load data from URL or localStorage on initial render
  useEffect(() => {
    if (isInitialized) return

    const data = searchParams.get("data")
    if (data) {
      try {
        const decompressed = decompressFromEncodedURIComponent(data)
        if (decompressed) {
          const parsedData: DiagramData = JSON.parse(decompressed)
          setDiagramCode(parsedData.mermaidCode)
          if (parsedData.settings?.theme) {
            setMermaidTheme(parsedData.settings.theme as "base" | "default" | "dark" | "forest" | "neutral" | "null")
          }
        }
      } catch (error) {
        console.error("Failed to parse diagram data from URL", error)
      }
    } else {
      // Try to load from localStorage
      const savedDiagram = localStorage.getItem("mermaidDiagram")
      if (savedDiagram) {
        try {
          const parsedData: DiagramData = JSON.parse(savedDiagram)
          setDiagramCode(parsedData.mermaidCode)
          if (parsedData.settings?.theme) {
            setMermaidTheme(parsedData.settings.theme as "base" | "default" | "dark" | "forest" | "neutral" | "null")
          }
        } catch (error) {
          console.error("Failed to parse saved diagram", error)
        }
      }
    }

    setIsInitialized(true)
  }, [searchParams, isInitialized])

  // Save to localStorage and update URL with debounce
  useEffect(() => {
    if (!isInitialized) return

    // Skip if this update was triggered by URL change
    if (skipNextUpdateRef.current) {
      skipNextUpdateRef.current = false
      return
    }

    // Save to localStorage immediately
    const diagramData: DiagramData = {
      mermaidCode: diagramCode,
      settings: {
        theme: mermaidTheme,
      },
      appVersion: 1,
    }
    localStorage.setItem("mermaidDiagram", JSON.stringify(diagramData))

    // Debounce URL updates to prevent excessive history entries
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current)
    }

    updateTimeoutRef.current = setTimeout(() => {
      const jsonString = JSON.stringify(diagramData)
      const compressed = compressToEncodedURIComponent(jsonString)

      // Only update URL if it's different from current
      const currentUrlData = new URL(window.location.href).searchParams.get("data")
      if (currentUrlData !== compressed) {
        const url = `${window.location.pathname}?data=${compressed}`
        window.history.replaceState({}, "", url)
      }
    }, 1000) // 1 second debounce

    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current)
      }
    }
  }, [diagramCode, mermaidTheme, isInitialized])

  const handleCodeChange = (newCode: string) => {
    setDiagramCode(newCode)
  }

  const handleMermaidThemeChange = (newTheme: string) => {
    if (newTheme === "base" || newTheme === "default" || newTheme === "dark" || 
        newTheme === "forest" || newTheme === "neutral" || newTheme === "null") {
      setMermaidTheme(newTheme)
    }
  }

  const generateShareUrl = () => {
    const diagramData: DiagramData = {
      mermaidCode: diagramCode,
      settings: {
        theme: mermaidTheme,
      },
      appVersion: 1,
    }

    const jsonString = JSON.stringify(diagramData)
    const compressed = compressToEncodedURIComponent(jsonString)
    return `${window.location.origin}/?data=${compressed}`
  }

  const toggleExpandEditor = () => {
    if (isExpanded) {
      setEditorSize(50) // Reset to default 50%
    } else {
      setEditorSize(67) // Expand to 67% (2/3)
    }
    setIsExpanded(!isExpanded)
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <Toolbar
        theme={mermaidTheme}
        onThemeChange={handleMermaidThemeChange}
        generateShareUrl={generateShareUrl}
        diagramCode={diagramCode}
      />
      <ResizablePanelGroup
        direction="horizontal"
        className="flex-1 overflow-hidden"
      >
        <ResizablePanel 
          defaultSize={editorSize}
          minSize={30}
          className="h-full"
          onResize={(size) => {
            setEditorSize(size);
            // Reset isExpanded state if user manually resizes
            if (size !== 50 && size !== 67) {
              setIsExpanded(false);
            }
          }}
        >
          <DiagramEditor 
            code={diagramCode} 
            onChange={handleCodeChange} 
            onToggleExpand={toggleExpandEditor}
            isExpanded={isExpanded}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel className="h-full">
          <div className="h-full w-full overflow-auto p-4">
            <DiagramRenderer code={diagramCode} theme={mermaidTheme} />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
