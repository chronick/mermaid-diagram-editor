"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { mermaidExamples } from "@/lib/helpers"
import { formatExampleName, loadMermaidExample } from "@/lib/services/examples-service"

interface HelpDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface ExampleData {
  filename: string
  displayName: string
  content: string
}

export default function HelpDialog({ open, onOpenChange }: HelpDialogProps) {
  const [examples, setExamples] = useState<ExampleData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadExamples() {
      setLoading(true)
      try {
        const loadedExamples = await Promise.all(
          mermaidExamples.map(async (filename) => {
            const content = await loadMermaidExample(filename)
            return {
              filename,
              displayName: formatExampleName(filename),
              content
            }
          })
        )
        setExamples(loadedExamples)
      } catch (error) {
        console.error("Failed to load examples:", error)
      } finally {
        setLoading(false)
      }
    }

    if (open) {
      loadExamples()
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Mermaid Diagram Help</DialogTitle>
          <DialogDescription>Learn how to create diagrams with Mermaid syntax</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <p>Loading examples...</p>
          ) : (
            examples.map((example) => (
              <div key={example.filename}>
                <h3 className="text-lg font-medium">{example.displayName}</h3>
                <pre className="bg-muted p-2 rounded-md text-sm">
                  {example.content}
                </pre>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 