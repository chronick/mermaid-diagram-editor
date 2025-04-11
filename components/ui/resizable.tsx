"use client"

import { GripVertical } from "lucide-react"
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels"
import { cn } from "@/lib/utils"

export function ResizablePanelGroup({
  className,
  ...props
}: React.ComponentProps<typeof PanelGroup>) {
  return (
    <PanelGroup
      className={cn(
        "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
        className
      )}
      {...props}
    />
  )
}

export function ResizablePanel({
  className,
  ...props
}: React.ComponentProps<typeof Panel>) {
  return (
    <Panel
      className={cn("relative h-full", className)}
      {...props}
    />
  )
}

export function ResizableHandle({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof PanelResizeHandle> & {
  withHandle?: boolean
}) {
  return (
    <PanelResizeHandle
      className={cn(
        "relative flex w-px items-center justify-center bg-gray-200 hover:bg-gray-400 transition-colors",
        className
      )}
      {...props}
    >
      {withHandle && (
        <div className="z-10 flex h-8 w-4 items-center justify-center rounded-sm border bg-gray-200 hover:bg-gray-300 transition-colors">
          <GripVertical className="h-4 w-4" />
        </div>
      )}
    </PanelResizeHandle>
  )
}
