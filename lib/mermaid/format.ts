/**
 * Format mermaid diagram code with proper indentation
 */
export function prettyFormat(code: string): string {
  try {
    // Better formatting for mermaid diagrams
    // Track indentation levels to preserve structure
    let lines = code.split('\n')
    let formattedLines: string[] = []
    let currentIndent = 0
    let inBlock = false
    
    // Process each line
    for (let line of lines) {
      const trimmedLine = line.trim()
      
      // Skip empty lines
      if (!trimmedLine) continue
      
      // Check if line contains block start/end markers
      if (trimmedLine.includes('{')) {
        inBlock = true
        currentIndent += 2 // Increase indent for next line
        formattedLines.push(' '.repeat(Math.max(0, currentIndent - 2)) + trimmedLine)
      } else if (trimmedLine.includes('}')) {
        currentIndent = Math.max(0, currentIndent - 2) // Decrease indent
        inBlock = false
        formattedLines.push(' '.repeat(currentIndent) + trimmedLine)
      } else if (trimmedLine.startsWith('+') || trimmedLine.startsWith('-')) {
        // Property or method - keep indented
        formattedLines.push(' '.repeat(currentIndent) + trimmedLine)
      } else if (trimmedLine.includes('--') || trimmedLine.includes('-->') || 
                 trimmedLine.includes('<--') || trimmedLine.includes('<|--') || 
                 trimmedLine.includes('--|>')) {
        // Relations - don't indent
        formattedLines.push(trimmedLine)
      } else {
        // Other content
        formattedLines.push(inBlock ? ' '.repeat(currentIndent) + trimmedLine : trimmedLine)
      }
    }
    
    // Return the formatted code
    return formattedLines.join('\n')
  } catch (error) {
    console.error("Error formatting diagram:", error)
    return code // Return original code if formatting fails
  }
} 