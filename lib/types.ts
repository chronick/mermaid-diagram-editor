export interface DiagramData {
  mermaidCode: string
  settings: {
    theme: string
    [key: string]: any
  }
  appVersion: number
}
