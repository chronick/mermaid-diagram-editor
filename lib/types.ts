export type MermaidTheme = "base" | "default" | "dark" | "forest" | "neutral" | "null";

export interface DiagramSettings {
  theme: MermaidTheme;
}

export interface DiagramData {
  mermaidCode: string;
  settings: DiagramSettings;
  appVersion: number;
}

export interface DiagramRenderResult {
  success: boolean;
  svg?: string;
  error?: string;
}
