"use client"

import { render } from "@testing-library/react"
import DiagramEditor from "@/components/diagram-editor"
import "@testing-library/jest-dom"

// Mock Monaco Editor
jest.mock("@monaco-editor/react", () => {
  return jest.fn(({ value, onChange }) => (
    <div data-testid="monaco-editor">
      <textarea data-testid="mock-editor" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  ))
})

describe("DiagramEditor", () => {
  it("renders the editor with provided code", () => {
    const { getByTestId } = render(<DiagramEditor code="test code" onChange={() => {}} />)

    const mockEditor = getByTestId("mock-editor")
    expect(mockEditor).toHaveValue("test code")
  })

  it("calls onChange when code changes", () => {
    const handleChange = jest.fn()
    const { getByTestId } = render(<DiagramEditor code="test code" onChange={handleChange} />)

    const mockEditor = getByTestId("mock-editor")
    mockEditor.value = "new code"
    mockEditor.dispatchEvent(new Event("change"))

    expect(handleChange).toHaveBeenCalled()
  })
})
