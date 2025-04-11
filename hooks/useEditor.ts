import { useRef, useState, useEffect } from "react";
import { prettyFormat } from "@/lib/mermaid/format";
import { useTheme } from "next-themes";

type Editor = any;
type Monaco = any;
type VimMode = any;

interface UseEditorResult {
  editorRef: React.RefObject<Editor>;
  vimStatusBarRef: React.RefObject<HTMLDivElement | null>;
  editorTheme: string;
  copied: boolean;
  handleEditorDidMount: (editor: Editor, monaco: Monaco) => Promise<void>;
  handleCopy: () => void;
  handleFormat: () => void;
  handlePrettyFormat: (onChange: (value: string) => void) => void;
}

export function useEditor(): UseEditorResult {
  const editorRef = useRef<Editor>(null);
  const vimStatusBarRef = useRef<HTMLDivElement | null>(null);
  const [vimMode, setVimMode] = useState<VimMode | null>(null);
  const [copied, setCopied] = useState(false);
  const { theme, resolvedTheme } = useTheme();
  const [editorTheme, setEditorTheme] = useState<string>("vs-dark");
  
  // Update editor theme when app theme changes
  useEffect(() => {
    // resolvedTheme handles system preference
    setEditorTheme(resolvedTheme === "dark" ? "vs-dark" : "vs");
  }, [resolvedTheme]);
  
  // Cleanup vim mode when component unmounts
  useEffect(() => {
    return () => {
      if (vimMode) {
        vimMode.dispose();
      }
    };
  }, [vimMode]);
  
  // Initialize vim mode and mermaid syntax highlighting
  const handleEditorDidMount = async (editor: Editor, monaco: Monaco) => {
    editorRef.current = editor;
    
    // Initialize mermaid syntax highlighting
    const initMermaid = (await import("monaco-mermaid")).default;
    initMermaid(monaco);
    
    // Initialize Vim mode
    const { initVimMode } = await import("monaco-vim");
    const vim = initVimMode(editor, vimStatusBarRef.current);
    setVimMode(vim);
  };
  
  // Copy code to clipboard
  const handleCopy = () => {
    if (editorRef.current) {
      const code = editorRef.current.getValue();
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  // Format the code
  const handleFormat = () => {
    if (editorRef.current) {
      editorRef.current.getAction("editor.action.formatDocument").run();
    }
  };
  
  // Use the extracted pretty format function
  const handlePrettyFormat = (onChange: (value: string) => void) => {
    if (editorRef.current) {
      const code = editorRef.current.getValue();
      try {
        const formatted = prettyFormat(code);
        editorRef.current.setValue(formatted);
        onChange(formatted);
      } catch (error) {
        console.error("Error formatting diagram:", error);
      }
    }
  };

  return {
    editorRef,
    vimStatusBarRef,
    editorTheme,
    copied,
    handleEditorDidMount,
    handleCopy,
    handleFormat,
    handlePrettyFormat
  };
} 