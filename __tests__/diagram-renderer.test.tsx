import { render, screen, waitFor } from "@testing-library/react"
import DiagramRenderer from "@/components/diagram-renderer"
import "@testing-library/jest-dom"

// Mock mermaid
jest.mock("mermaid", () => ({
  initialize: jest.fn(),
  parse: jest.fn(),
  render: jest.fn().mockImplementation((id, code) => {
    if (code.includes("error")) {
      return Promise.reject(new Error("Syntax error"))
    }
    return Promise.resolve({ svg: "<svg>Test SVG</svg>" })
  }),
}))

describe("DiagramRenderer", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders a loading state initially", () => {
    render(<DiagramRenderer code="sequenceDiagram" theme="default" />)
    expect(screen.getByText("Start typing to create a diagram")).toBeInTheDocument()
  })

  it("renders the diagram when code is valid", async () => {
    const { container } = render(<DiagramRenderer code="sequenceDiagram" theme="default" />)

    await waitFor(() => {
      expect(container.innerHTML).toContain("Test SVG")
    })
  })

  it("shows an error indicator when code is invalid", async () => {
    render(<DiagramRenderer code="sequenceDiagram with error" theme="default" />)

    await waitFor(() => {
      const errorIcon = screen.getByRole("img", { hidden: true })
      expect(errorIcon).toBeInTheDocument()
    })
  })

  it("keeps the last valid diagram when an error occurs", async () => {
    const { container, rerender } = render(<DiagramRenderer code="sequenceDiagram" theme="default" />)

    // Wait for the first valid render
    await waitFor(() => {
      expect(container.innerHTML).toContain("Test SVG")
    })

    // Rerender with invalid code
    rerender(<DiagramRenderer code="sequenceDiagram with error" theme="default" />)

    // Should still contain the SVG from the first render
    await waitFor(() => {
      expect(container.innerHTML).toContain("Test SVG")
      const errorIcon = screen.getByRole("img", { hidden: true })
      expect(errorIcon).toBeInTheDocument()
    })
  })
})
