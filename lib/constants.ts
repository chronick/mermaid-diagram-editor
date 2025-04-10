import { compressToEncodedURIComponent } from "lz-string"

export const defaultDiagramCode = `sequenceDiagram
  participant Alice
  participant Bob
  Alice->>Bob: Hello Bob, how are you?
  Bob-->>Alice: I'm good thanks!
  Alice->>Bob: Do you know about Mermaid?
  Bob-->>Alice: Yes! It's what we're using now!`

// Pre-compressed templates for quick access
export const diagramTemplates = {
  "Sequence Diagram": compressToEncodedURIComponent(
    JSON.stringify({
      mermaidCode: `sequenceDiagram
    participant A as Alice
    participant B as Bob
    A->>B: Hello Bob, how are you?
    B-->>A: I'm good thanks!
    A->>B: Do you know about Mermaid?
    B-->>A: Yes! It's what we're using now!`,
      settings: { theme: "default" },
      appVersion: 1,
    }),
  ),
  Flowchart: compressToEncodedURIComponent(
    JSON.stringify({
      mermaidCode: `flowchart TD
    A[Start] --> B{Is it?}
    B -->|Yes| C[OK]
    C --> D[Rethink]
    D --> B
    B ---->|No| E[End]`,
      settings: { theme: "default" },
      appVersion: 1,
    }),
  ),
  "Class Diagram": compressToEncodedURIComponent(
    JSON.stringify({
      mermaidCode: `classDiagram
    Animal <|-- Duck
    Animal <|-- Fish
    Animal <|-- Zebra
    Animal : +int age
    Animal : +String gender
    Animal: +isMammal()
    Animal: +mate()
    class Duck{
      +String beakColor
      +swim()
      +quack()
    }`,
      settings: { theme: "default" },
      appVersion: 1,
    }),
  ),
  "Gantt Chart": compressToEncodedURIComponent(
    JSON.stringify({
      mermaidCode: `gantt
    title A Gantt Diagram
    dateFormat  YYYY-MM-DD
    section Section
    A task           :a1, 2023-01-01, 30d
    Another task     :after a1, 20d
    section Another
    Task in sec      :2023-01-12, 12d
    another task     :24d`,
      settings: { theme: "default" },
      appVersion: 1,
    }),
  ),
}
