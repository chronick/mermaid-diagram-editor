"use client"

import { useRef } from "react"
import Editor from "@monaco-editor/react"

interface DiagramEditorProps {
  code: string
  onChange: (value: string) => void
}

export default function DiagramEditor({ code, onChange }: DiagramEditorProps) {
  const editorRef = useRef<any>(null)

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor
  }

  return (
    <div className="h-full w-full">
      <Editor
        height="100%"
        defaultLanguage="markdown"
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
        theme="vs-dark"
      />
    </div>
  )
}
