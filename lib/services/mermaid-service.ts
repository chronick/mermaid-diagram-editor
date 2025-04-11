import mermaid from "mermaid";
import type { MermaidTheme, DiagramRenderResult } from "@/lib/types";

/**
 * Initialize mermaid with the specified theme
 */
export function initializeMermaid(theme: MermaidTheme = "default"): void {
  mermaid.initialize({
    startOnLoad: true,
    theme,
    securityLevel: "loose",
    logLevel: "error",
  });
}

/**
 * Parse mermaid diagram code to check for syntax errors
 */
export async function parseMermaid(code: string): Promise<boolean> {
  try {
    await mermaid.parse(code);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Render a mermaid diagram
 */
export async function renderMermaid(code: string): Promise<DiagramRenderResult> {
  try {
    // Try to parse the diagram first to check for syntax errors
    await mermaid.parse(code);

    // If parsing succeeds, render the diagram
    const { svg } = await mermaid.render("diagram", code);

    return {
      success: true,
      svg,
    };
  } catch (err: any) {
    console.error("Mermaid rendering error:", err);
    return {
      success: false,
      error: err.message || "Failed to render diagram",
    };
  }
} 