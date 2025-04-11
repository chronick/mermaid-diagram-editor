"use client"

import { Copy, Code, Maximize2, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import dynamic from "next/dynamic"
import { useEditor } from "@/hooks/useEditor"

// Dynamically import Monaco editor with no SSR
const MonacoEditor = dynamic(
  () => import("@monaco-editor/react").then((mod) => mod.default),
  { ssr: false }
)

interface DiagramEditorProps {
  code: string
  onChange: (value: string) => void
  onToggleExpand?: () => void
  isExpanded?: boolean
}

export default function DiagramEditor({ 
  code, 
  onChange, 
  onToggleExpand, 
  isExpanded = false 
}: DiagramEditorProps) {
  const {
    editorRef,
    vimStatusBarRef,
    editorTheme,
    copied,
    handleEditorDidMount,
    handleCopy,
    handleFormat,
    handlePrettyFormat
  } = useEditor()

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex justify-end gap-3 p-2 bg-muted/20 rounded-md">
        <Button 
          onClick={handleCopy}
          variant="outline"
          size="icon"
          title="Copy code"
        >
          {copied ? "Copied!" : <Copy size={16} />}
        </Button>
        <Button 
          onClick={handleFormat}
          variant="outline"
          size="icon"
          title="Format code"
        >
          <Code size={16} />
        </Button>
        <Button 
          onClick={() => handlePrettyFormat(onChange)}
          variant="outline"
          size="icon"
          title="Pretty format diagram"
        >
          <Code size={16} />
        </Button>
        {onToggleExpand && (
          <Button 
            onClick={onToggleExpand}
            variant="outline"
            size="icon"
            title={isExpanded ? "Collapse editor" : "Expand editor"}
          >
            {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </Button>
        )}
      </div>
      
      <div className="flex-1 border rounded">
        <MonacoEditor
          height="100%"
          defaultLanguage="mermaid"
          value={code}
          onChange={(value) => onChange(value || "")}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
          theme={editorTheme}
        />
      </div>
      
      {/* Vim status bar */}
      <div 
        ref={vimStatusBarRef} 
        className={cn(
          "vim-status-bar mt-2 h-6 flex items-center px-2 text-sm",
          editorTheme === "vs-dark" ? "bg-zinc-800 text-zinc-200" : "bg-gray-200 text-gray-800"
        )}
      ></div>
    </div>
  )
}
