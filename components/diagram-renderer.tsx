"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { initializeMermaid, renderMermaid } from "@/lib/services/mermaid-service"
import type { MermaidTheme } from "@/lib/types"

interface DiagramRendererProps {
  code: string
  theme: MermaidTheme
}

export default function DiagramRenderer({ code, theme }: DiagramRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [lastValidSvg, setLastValidSvg] = useState<string | null>(null)
  const [isRendering, setIsRendering] = useState(false)

  // Initialize mermaid when theme changes
  useEffect(() => {
    initializeMermaid(theme)
  }, [theme])

  // Render diagram when code changes
  useEffect(() => {
    const renderDiagram = async () => {
      if (!containerRef.current) return

      setIsRendering(true)

      try {
        const result = await renderMermaid(code)

        if (result.success && result.svg) {
          // If rendering was successful
          setError(null)
          setLastValidSvg(result.svg)

          // Update the container with the new SVG
          if (containerRef.current) {
            containerRef.current.innerHTML = result.svg
          }
        } else {
          // If there was an error
          setError(result.error || "Failed to render diagram")

          // Don't update the container - keep showing the last valid diagram
          if (lastValidSvg && containerRef.current) {
            containerRef.current.innerHTML = lastValidSvg
          }
        }
      } catch (err: any) {
        console.error("Unexpected error:", err)
        setError(err.message || "Failed to render diagram")
      } finally {
        setIsRendering(false)
      }
    }

    // Add a small delay to avoid too many re-renders
    const timer = setTimeout(() => {
      renderDiagram()
    }, 300)

    return () => clearTimeout(timer)
  }, [code, lastValidSvg])

  return (
    <Card className="h-full overflow-auto relative">
      <CardContent className="p-4">
        {/* Error indicator that appears at the top without replacing the diagram */}
        {error && (
          <div className="absolute top-2 right-2 z-10">
            <div className="bg-destructive text-destructive-foreground rounded-full p-2 shadow-md cursor-help group relative">
              <AlertCircle className="h-5 w-5" />
              <div className="hidden group-hover:block absolute right-0 top-full mt-2 bg-background border border-border rounded-md p-2 shadow-lg w-64 text-xs">
                <p className="font-semibold">Syntax Error</p>
                <p className="mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Rendering indicator */}
        {isRendering && (
          <div className="absolute top-2 left-2 z-10">
            <div className="bg-muted rounded-full p-1 shadow-md">
              <div className="h-3 w-3 rounded-full bg-primary animate-pulse"></div>
            </div>
          </div>
        )}

        {/* The diagram container */}
        <div ref={containerRef} className="w-full overflow-auto min-h-[200px]">
          {/* Initial state if no valid SVG yet */}
          {!lastValidSvg && !error && !isRendering && (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              Start typing to create a diagram
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
