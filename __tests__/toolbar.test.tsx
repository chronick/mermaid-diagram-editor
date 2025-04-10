import { render, screen, fireEvent } from "@testing-library/react"
import Toolbar from "@/components/toolbar"
import "@testing-library/jest-dom"

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn().mockImplementation(() => Promise.resolve()),
  },
})

// Mock URL creation
global.URL.createObjectURL = jest.fn(() => "blob:test")
global.URL.revokeObjectURL = jest.fn()

describe("Toolbar", () => {
  const mockProps = {
    theme: "default",
    onThemeChange: jest.fn(),
    generateShareUrl: jest.fn(() => "https://example.com/share"),
    diagramCode: "sequenceDiagram",
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders the toolbar with title", () => {
    render(<Toolbar {...mockProps} />)
    expect(screen.getByText("Mermaid Diagram Editor")).toBeInTheDocument()
  })

  it("shows theme selector with correct value", () => {
    render(<Toolbar {...mockProps} />)
    expect(screen.getByRole("combobox")).toHaveValue("default")
  })

  it("calls onThemeChange when theme is changed", () => {
    render(<Toolbar {...mockProps} />)
    fireEvent.click(screen.getByRole("combobox"))
    fireEvent.click(screen.getByText("Dark"))
    expect(mockProps.onThemeChange).toHaveBeenCalledWith("dark")
  })

  it("opens share dialog when share button is clicked", () => {
    render(<Toolbar {...mockProps} />)
    fireEvent.click(screen.getByText("Share"))
    expect(screen.getByText("Share Diagram")).toBeInTheDocument()
    expect(mockProps.generateShareUrl).toHaveBeenCalled()
  })

  it("copies URL to clipboard when copy button is clicked", async () => {
    render(<Toolbar {...mockProps} />)
    fireEvent.click(screen.getByText("Share"))
    fireEvent.click(screen.getByRole("button", { name: /copy/i }))
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("https://example.com/share")
  })
})
