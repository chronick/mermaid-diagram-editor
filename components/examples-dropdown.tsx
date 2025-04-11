"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu"
import { mermaidExamples, loadMermaidExample, formatExampleName, createShareableUrl } from "@/lib/helpers"
import { diagramTemplates } from "@/lib/constants"

interface ExamplesDropdownProps {
  theme: string
}

export default function ExamplesDropdown({ theme }: ExamplesDropdownProps) {
  const [exampleOptions, setExampleOptions] = useState<{name: string, filename: string}[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initialize example options for dropdown
    const options = mermaidExamples.map(filename => ({
      name: formatExampleName(filename),
      filename
    }))
    setExampleOptions(options)
    setLoading(false)
  }, [])

  const loadExample = async (filename: string) => {
    try {
      setLoading(true)
      const content = await loadMermaidExample(filename)
      if (content) {
        // Create a shareable URL with the example content
        const url = createShareableUrl(content, theme)
        window.location.href = url
      }
    } catch (error) {
      console.error("Failed to load example", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={loading}>Examples</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-h-[300px] overflow-y-auto">
        <DropdownMenuLabel>Templates</DropdownMenuLabel>
        {Object.entries(diagramTemplates).map(([key, template]) => (
          <DropdownMenuItem key={key} onClick={() => (window.location.href = `/?data=${template}`)}>
            {key}
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Examples</DropdownMenuLabel>
        {exampleOptions.map((example) => (
          <DropdownMenuItem 
            key={example.filename} 
            onClick={() => loadExample(example.filename)}
          >
            {example.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 