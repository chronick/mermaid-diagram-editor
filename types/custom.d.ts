declare module 'monaco-vim' {
  export function initVimMode(editor: any, statusBarElement: HTMLElement | null): any;
}

declare module 'monaco-mermaid' {
  export default function initMermaid(monaco: any): void;
} 