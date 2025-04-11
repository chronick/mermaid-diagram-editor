import { compressToEncodedURIComponent } from "lz-string"

export const defaultDiagramCode = `sequenceDiagram
  participant Alice
  participant Bob
  Alice->>Bob: Hello Bob, how are you?
  Bob-->>Alice: I'm good thanks!
  Alice->>Bob: Do you know about Mermaid?
  Bob-->>Alice: Yes! It's what we're using now!`
