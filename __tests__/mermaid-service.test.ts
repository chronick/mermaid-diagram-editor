import { initializeMermaid, parseMermaid, renderMermaid } from "@/lib/services/mermaid-service";
import mermaid from "mermaid";

// Mock mermaid module
jest.mock("mermaid", () => ({
  initialize: jest.fn(),
  parse: jest.fn(),
  render: jest.fn(),
}));

describe("Mermaid Service", () => {
  // Original console.error to restore later
  const originalConsoleError = console.error;
  
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock console.error to silence expected errors during testing
    console.error = jest.fn();
  });
  
  afterEach(() => {
    // Restore original console.error
    console.error = originalConsoleError;
  });

  describe("initializeMermaid", () => {
    it("should initialize mermaid with default theme", () => {
      initializeMermaid();
      expect(mermaid.initialize).toHaveBeenCalledWith({
        startOnLoad: true,
        theme: "default",
        securityLevel: "loose",
        logLevel: "error",
      });
    });

    it("should initialize mermaid with custom theme", () => {
      initializeMermaid("dark");
      expect(mermaid.initialize).toHaveBeenCalledWith({
        startOnLoad: true,
        theme: "dark",
        securityLevel: "loose",
        logLevel: "error",
      });
    });
  });

  describe("parseMermaid", () => {
    it("should return true for valid mermaid code", async () => {
      (mermaid.parse as jest.Mock).mockResolvedValueOnce(true);
      const result = await parseMermaid("sequenceDiagram");
      expect(result).toBe(true);
      expect(mermaid.parse).toHaveBeenCalledWith("sequenceDiagram");
    });

    it("should return false for invalid mermaid code", async () => {
      (mermaid.parse as jest.Mock).mockRejectedValueOnce(new Error("Invalid diagram"));
      const result = await parseMermaid("invalid code");
      expect(result).toBe(false);
      expect(mermaid.parse).toHaveBeenCalledWith("invalid code");
    });
  });

  describe("renderMermaid", () => {
    it("should return success and SVG for valid diagram", async () => {
      (mermaid.parse as jest.Mock).mockResolvedValueOnce(true);
      (mermaid.render as jest.Mock).mockResolvedValueOnce({ svg: "<svg>Test SVG</svg>" });
      
      const result = await renderMermaid("sequenceDiagram");
      
      expect(result).toEqual({
        success: true,
        svg: "<svg>Test SVG</svg>",
      });
      expect(mermaid.parse).toHaveBeenCalledWith("sequenceDiagram");
      expect(mermaid.render).toHaveBeenCalledWith("diagram", "sequenceDiagram");
    });

    it("should return error for invalid diagram", async () => {
      const errorMessage = "Syntax error in diagram";
      (mermaid.parse as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));
      
      const result = await renderMermaid("invalid diagram");
      
      expect(result).toEqual({
        success: false,
        error: errorMessage,
      });
      expect(mermaid.parse).toHaveBeenCalledWith("invalid diagram");
      expect(mermaid.render).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalled();
    });

    it("should handle unexpected errors", async () => {
      (mermaid.parse as jest.Mock).mockResolvedValueOnce(true);
      (mermaid.render as jest.Mock).mockRejectedValueOnce(new Error("Render error"));
      
      const result = await renderMermaid("sequenceDiagram");
      
      expect(result).toEqual({
        success: false,
        error: "Render error",
      });
      expect(console.error).toHaveBeenCalled();
    });
  });
}); 