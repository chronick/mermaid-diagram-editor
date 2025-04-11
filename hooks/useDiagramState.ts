import { useState, useEffect, useRef } from "react";
import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from "lz-string";
import { defaultDiagramCode } from "@/lib/constants";
import type { DiagramData, MermaidTheme } from "@/lib/types";

interface UseDiagramStateProps {
  initialCode?: string;
  initialTheme?: MermaidTheme;
  searchParamsData?: string | null;
}

export function useDiagramState({
  initialCode = defaultDiagramCode,
  initialTheme = "default",
  searchParamsData = null,
}: UseDiagramStateProps = {}) {
  const [diagramCode, setDiagramCode] = useState<string>(initialCode);
  const [mermaidTheme, setMermaidTheme] = useState<MermaidTheme>(initialTheme);
  const [isInitialized, setIsInitialized] = useState(false);
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const skipNextUpdateRef = useRef(false);

  // Load data from URL or localStorage on initial render
  useEffect(() => {
    if (isInitialized) return;

    if (searchParamsData) {
      try {
        const decompressed = decompressFromEncodedURIComponent(searchParamsData);
        if (decompressed) {
          const parsedData: DiagramData = JSON.parse(decompressed);
          setDiagramCode(parsedData.mermaidCode);
          if (parsedData.settings?.theme) {
            setMermaidTheme(parsedData.settings.theme);
          }
        }
      } catch (error) {
        console.error("Failed to parse diagram data from URL", error);
      }
    } else {
      // Try to load from localStorage
      const savedDiagram = localStorage.getItem("mermaidDiagram");
      if (savedDiagram) {
        try {
          const parsedData: DiagramData = JSON.parse(savedDiagram);
          setDiagramCode(parsedData.mermaidCode);
          if (parsedData.settings?.theme) {
            setMermaidTheme(parsedData.settings.theme);
          }
        } catch (error) {
          console.error("Failed to parse saved diagram", error);
        }
      }
    }

    setIsInitialized(true);
  }, [searchParamsData, isInitialized, initialCode, initialTheme]);

  // Save to localStorage and update URL with debounce
  useEffect(() => {
    if (!isInitialized) return;

    // Skip if this update was triggered by URL change
    if (skipNextUpdateRef.current) {
      skipNextUpdateRef.current = false;
      return;
    }

    // Save to localStorage immediately
    const diagramData: DiagramData = {
      mermaidCode: diagramCode,
      settings: {
        theme: mermaidTheme,
      },
      appVersion: 1,
    };
    
    localStorage.setItem("mermaidDiagram", JSON.stringify(diagramData));

    // Debounce URL updates to prevent excessive history entries
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    updateTimeoutRef.current = setTimeout(() => {
      const jsonString = JSON.stringify(diagramData);
      const compressed = compressToEncodedURIComponent(jsonString);

      // Only update URL if it's different from current
      const currentUrlData = new URL(window.location.href).searchParams.get("data");
      if (currentUrlData !== compressed) {
        const url = `${window.location.pathname}?data=${compressed}`;
        window.history.replaceState({}, "", url);
      }
    }, 1000); // 1 second debounce

    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, [diagramCode, mermaidTheme, isInitialized]);

  const generateShareUrl = () => {
    const diagramData: DiagramData = {
      mermaidCode: diagramCode,
      settings: {
        theme: mermaidTheme,
      },
      appVersion: 1,
    };

    const jsonString = JSON.stringify(diagramData);
    const compressed = compressToEncodedURIComponent(jsonString);
    return `${window.location.origin}/?data=${compressed}`;
  };

  return {
    diagramCode,
    setDiagramCode,
    mermaidTheme,
    setMermaidTheme,
    generateShareUrl,
    isInitialized,
  };
} 