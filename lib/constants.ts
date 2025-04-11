import { compressToEncodedURIComponent } from "lz-string"

export const defaultDiagramCode = `sequenceDiagram
  participant Alice
  participant Bob
  Alice->>Bob: Hello Bob, how are you?
  Bob-->>Alice: I'm good thanks!
  Alice->>Bob: Do you know about Mermaid?
  Bob-->>Alice: Yes! It's what we're using now!`

// Pre-compressed templates for quick access
// These will be supplemented by the examples loaded from files
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
  "Flowchart": compressToEncodedURIComponent(
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
  "Netflix Pie Chart": compressToEncodedURIComponent(
    JSON.stringify({
      mermaidCode: `pie title NETFLIX
    "Time spent looking for movie" : 90
    "Time spent watching it" : 10`,
      settings: { theme: "default" },
      appVersion: 1,
    }),
  ),
  "Voldemort Pie Chart": compressToEncodedURIComponent(
    JSON.stringify({
      mermaidCode: `pie title What Voldemort doesn't have?
    "FRIENDS" : 2
    "FAMILY" : 3
    "NOSE" : 45`,
      settings: { theme: "default" },
      appVersion: 1,
    }),
  ),
  "Complex Sequence Diagram": compressToEncodedURIComponent(
    JSON.stringify({
      mermaidCode: `sequenceDiagram
    Alice ->> Bob: Hello Bob, how are you?
    Bob-->>John: How about you John?
    Bob--x Alice: I am good thanks!
    Bob-x John: I am good thanks!
    Note right of John: Bob thinks a long<br/>long time, so long<br/>that the text does<br/>not fit on a row.

    Bob-->Alice: Checking with John...
    Alice->John: Yes... John, how are you?`,
      settings: { theme: "default" },
      appVersion: 1,
    }),
  ),
  "Blog Service Flow": compressToEncodedURIComponent(
    JSON.stringify({
      mermaidCode: `sequenceDiagram
    participant web as Web Browser
    participant blog as Blog Service
    participant account as Account Service
    participant mail as Mail Service
    participant db as Storage

    Note over web,db: The user must be logged in to submit blog posts
    web->>+account: Logs in using credentials
    account->>db: Query stored accounts
    db->>account: Respond with query result

    alt Credentials not found
        account->>web: Invalid credentials
    else Credentials found
        account->>-web: Successfully logged in

        Note over web,db: When the user is authenticated, they can now submit new posts
        web->>+blog: Submit new post
        blog->>db: Store post data

        par Notifications
            blog--)mail: Send mail to blog subscribers
            blog--)db: Store in-site notifications
        and Response
            blog-->>-web: Successfully posted
        end
    end`,
      settings: { theme: "default" },
      appVersion: 1,
    }),
  ),
  "Git Commit Flow": compressToEncodedURIComponent(
    JSON.stringify({
      mermaidCode: `gitGraph:
    commit "Ashish"
    branch newbranch
    checkout newbranch
    commit id:"1111"
    commit tag:"test"
    checkout main
    commit type: HIGHLIGHT
    commit
    merge newbranch
    commit
    branch b2
    commit`,
      settings: { theme: "default" },
      appVersion: 1,
    }),
  ),
  "Styled Flowchart": compressToEncodedURIComponent(
    JSON.stringify({
      mermaidCode: `graph TB
    sq[Square shape] --> ci((Circle shape))

    subgraph A
        od>Odd shape]-- Two line<br/>edge comment --> ro
        di{Diamond with <br/> line break} -.-> ro(Rounded<br>square<br>shape)
        di==>ro2(Rounded square shape)
    end

    %% Notice that no text in shape are added here instead that is appended further down
    e --> od3>Really long text with linebreak<br>in an Odd shape]

    %% Comments after double percent signs
    e((Inner / circle<br>and some odd <br>special characters)) --> f(,.?!+-*ز)

    cyr[Cyrillic]-->cyr2((Circle shape Начало));

     classDef green fill:#9f6,stroke:#333,stroke-width:2px;
     classDef orange fill:#f96,stroke:#333,stroke-width:4px;
     class sq,e green
     class di orange`,
      settings: { theme: "default" },
      appVersion: 1,
    }),
  ),
}
