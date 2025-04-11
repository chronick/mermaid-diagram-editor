"use client"

import { render, fireEvent, screen } from "@testing-library/react"
import DiagramEditor from "@/components/diagram-editor"
import "@testing-library/jest-dom"

// Mock the dynamic import of MonacoEditor 
jest.mock("next/dynamic", () => () => {
  const DynamicMock = ({ value, onChange }: { value: string, onChange: (value: string) => void }) => (
    <div data-testid="monaco-editor-mock">
      <textarea 
        data-testid="mock-editor" 
        defaultValue={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
  return DynamicMock;
});

// Mock the useEditor hook
jest.mock("../hooks/useEditor", () => ({
  useEditor: () => ({
    editorRef: { current: null },
    vimStatusBarRef: { current: null },
    editorTheme: "vs",
    copied: false,
    handleEditorDidMount: jest.fn(),
    handleCopy: jest.fn(),
    handleFormat: jest.fn(),
    handlePrettyFormat: jest.fn()
  })
}));

describe("DiagramEditor", () => {
  it("renders editor buttons", () => {
    render(<DiagramEditor code="test code" onChange={() => {}} />);
    
    // Check that the toolbar buttons are rendered
    expect(screen.getByTitle("Copy code")).toBeInTheDocument();
    expect(screen.getByTitle("Format code")).toBeInTheDocument();
    expect(screen.getByTitle("Pretty format diagram")).toBeInTheDocument();
  });

  it("calls onChange when code changes", () => {
    const handleChange = jest.fn();
    render(<DiagramEditor code="test code" onChange={handleChange} />);

    // Find the mock editor and change its value
    const mockEditor = screen.getByTestId("mock-editor");
    fireEvent.change(mockEditor, { target: { value: "new code" } });
    
    expect(handleChange).toHaveBeenCalledWith("new code");
  });
});
