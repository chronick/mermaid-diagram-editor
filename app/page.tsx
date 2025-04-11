"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import DiagramEditor from "@/components/diagram-editor"
import DiagramRenderer from "@/components/diagram-renderer"
import Toolbar from "@/components/toolbar"
import { useDiagramState } from "@/hooks/useDiagramState"
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "@/components/ui/resizable"
import type { MermaidTheme } from "@/lib/types"

export default function Home() {
  const searchParams = useSearchParams()
  const searchParamsData = searchParams.get("data")
  
  const {
    diagramCode,
    setDiagramCode,
    mermaidTheme,
    setMermaidTheme,
    generateShareUrl,
  } = useDiagramState({
    searchParamsData
  })
  
  const [editorSize, setEditorSize] = useState(50) // Default 50% width
  const [isExpanded, setIsExpanded] = useState(false)

  const handleCodeChange = (newCode: string) => {
    setDiagramCode(newCode)
  }

  const handleMermaidThemeChange = (newTheme: string) => {
    if (newTheme === "base" || newTheme === "default" || newTheme === "dark" || 
        newTheme === "forest" || newTheme === "neutral" || newTheme === "null") {
      setMermaidTheme(newTheme as MermaidTheme)
    }
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
