"use client"

import { useEffect, useRef, useState } from "react"
import mermaid from "mermaid"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

interface DiagramRendererProps {
  code: string
  theme: "base" | "default" | "dark" | "forest" | "neutral" | "null"
}

export default function DiagramRenderer({ code, theme }: DiagramRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [lastValidSvg, setLastValidSvg] = useState<string | null>(null)
  const [isRendering, setIsRendering] = useState(false)

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: theme,
      securityLevel: "loose",
      logLevel: "error",
    })
  }, [theme])

  useEffect(() => {
    const renderDiagram = async () => {
      if (!containerRef.current) return

      setIsRendering(true)

      try {
        // Try to parse the diagram first to check for syntax errors
        await mermaid.parse(code)

        // If parsing succeeds, render the diagram
        const { svg } = await mermaid.render("diagram", code)

        // If we get here, the rendering was successful
        setError(null)
        setLastValidSvg(svg)

        // Update the container with the new SVG
        if (containerRef.current) {
          containerRef.current.innerHTML = svg
        }
      } catch (err: any) {
        console.error("Mermaid rendering error:", err)
        setError(err.message || "Failed to render diagram")

        // Don't update the container - keep showing the last valid diagram
        if (lastValidSvg && containerRef.current) {
          containerRef.current.innerHTML = lastValidSvg
        }
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
