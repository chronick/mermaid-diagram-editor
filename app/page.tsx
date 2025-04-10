"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import DiagramEditor from "@/components/diagram-editor"
import DiagramRenderer from "@/components/diagram-renderer"
import Toolbar from "@/components/toolbar"
import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from "lz-string"
import { defaultDiagramCode } from "@/lib/constants"
import type { DiagramData } from "@/lib/types"

export default function Home() {
  const searchParams = useSearchParams()
  const [diagramCode, setDiagramCode] = useState<string>(defaultDiagramCode)
  const [theme, setTheme] = useState<string>("default")
  const [isInitialized, setIsInitialized] = useState(false)
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const skipNextUpdateRef = useRef(false)

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
            setTheme(parsedData.settings.theme)
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
            setTheme(parsedData.settings.theme)
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
        theme: theme,
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
  }, [diagramCode, theme, isInitialized])

  const handleCodeChange = (newCode: string) => {
    setDiagramCode(newCode)
  }

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
  }

  const generateShareUrl = () => {
    const diagramData: DiagramData = {
      mermaidCode: diagramCode,
      settings: {
        theme: theme,
      },
      appVersion: 1,
    }

    const jsonString = JSON.stringify(diagramData)
    const compressed = compressToEncodedURIComponent(jsonString)
    return `${window.location.origin}/?data=${compressed}`
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <Toolbar
        theme={theme}
        onThemeChange={handleThemeChange}
        generateShareUrl={generateShareUrl}
        diagramCode={diagramCode}
      />
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        <div className="w-full md:w-1/2 h-1/2 md:h-full overflow-hidden border-r border-border">
          <DiagramEditor code={diagramCode} onChange={handleCodeChange} />
        </div>
        <div className="w-full md:w-1/2 h-1/2 md:h-full overflow-auto p-4">
          <DiagramRenderer code={diagramCode} theme={theme} />
        </div>
      </div>
    </div>
  )
}
