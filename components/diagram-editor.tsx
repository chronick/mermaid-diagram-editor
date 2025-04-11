"use client"

import { useRef, useEffect, useState } from "react"
import { Copy, Code, Maximize2, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import dynamic from "next/dynamic"
import { prettyFormat } from "@/lib/mermaid/format"
import { useTheme } from "next-themes"

// Dynamically import Monaco editor with no SSR
const MonacoEditor = dynamic(
  () => import("@monaco-editor/react").then((mod) => mod.default),
  { ssr: false }
)

// Dynamically import vim and mermaid modules
const initVimModeClient = async (editor: any, statusBarElement: HTMLDivElement | null) => {
  const { initVimMode } = await import("monaco-vim")
  return initVimMode(editor, statusBarElement)
}

const initMermaidClient = async (monaco: any) => {
  const initMermaid = (await import("monaco-mermaid")).default
  return initMermaid(monaco)
}

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
  const editorRef = useRef<any>(null)
  const vimStatusBarRef = useRef<HTMLDivElement>(null)
  const [vimMode, setVimMode] = useState<any>(null)
  const [copied, setCopied] = useState(false)
  const { theme, resolvedTheme } = useTheme()
  const [editorTheme, setEditorTheme] = useState<string>("vs-dark")
  
  // Update editor theme when app theme changes
  useEffect(() => {
    // resolvedTheme handles system preference
    setEditorTheme(resolvedTheme === "dark" ? "vs-dark" : "vs")
  }, [resolvedTheme])
  
  // Initialize vim mode and mermaid syntax highlighting
  const handleEditorDidMount = async (editor: any, monaco: any) => {
    editorRef.current = editor
    
    // Initialize mermaid syntax highlighting
    await initMermaidClient(monaco)
    
    // Initialize Vim mode
    const vim = await initVimModeClient(editor, vimStatusBarRef.current)
    setVimMode(vim)
  }
  
  // Cleanup vim mode when component unmounts
  useEffect(() => {
    return () => {
      if (vimMode) {
        vimMode.dispose()
      }
    }
  }, [vimMode])
  
  // Copy code to clipboard
  const handleCopy = () => {
    if (editorRef.current) {
      const code = editorRef.current.getValue()
      navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }
  
  // Format the code
  const handleFormat = () => {
    if (editorRef.current) {
      editorRef.current.getAction("editor.action.formatDocument").run()
    }
  }
  
  // Use the extracted pretty format function
  const handlePrettyFormat = () => {
    if (editorRef.current) {
      const code = editorRef.current.getValue()
      try {
        const formatted = prettyFormat(code)
        editorRef.current.setValue(formatted)
        onChange(formatted)
      } catch (error) {
        console.error("Error formatting diagram:", error)
      }
    }
  }

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
          onClick={handlePrettyFormat}
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
