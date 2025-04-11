import { renderHook, act } from "@testing-library/react";
import { useDiagramState } from "@/hooks/useDiagramState";
import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from "lz-string";
import { defaultDiagramCode } from "@/lib/constants";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Mock window.location and window.history
const mockHistoryReplaceState = jest.fn();
const originalLocation = window.location;
const originalHistory = window.history;

describe("useDiagramState", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
    
    // Mock window.location
    delete (window as any).location;
    window.location = {
      ...originalLocation,
      href: "http://localhost:3000/",
      pathname: "/",
      origin: "http://localhost:3000",
      search: "",
    } as Location;
    
    // Mock window.history
    delete (window as any).history;
    window.history = {
      ...originalHistory,
      replaceState: mockHistoryReplaceState,
    } as History;

    // Mock URL object
    global.URL = class URL {
      searchParams: URLSearchParams;
      constructor(url: string) {
        this.searchParams = new URLSearchParams();
      }
    } as any;
  });
  
  afterAll(() => {
    window.location = originalLocation;
    window.history = originalHistory;
  });

  it("should initialize with default values", () => {
    const { result } = renderHook(() => useDiagramState());
    
    expect(result.current.diagramCode).toBe(defaultDiagramCode);
    expect(result.current.mermaidTheme).toBe("default");
    expect(result.current.isInitialized).toBe(true);
  });

  it("should initialize with custom values", () => {
    const customCode = "graph TD;";
    const customTheme = "dark";
    
    const { result } = renderHook(() => useDiagramState({
      initialCode: customCode,
      initialTheme: customTheme,
    }));
    
    expect(result.current.diagramCode).toBe(customCode);
    expect(result.current.mermaidTheme).toBe(customTheme);
  });

  it("should update localStorage when diagram code changes", () => {
    const { result } = renderHook(() => useDiagramState());
    
    const newCode = "graph TD;";
    act(() => {
      result.current.setDiagramCode(newCode);
    });
    
    expect(localStorageMock.setItem).toHaveBeenCalled();
    
    // Get the last call arguments
    const lastCallArgs = (localStorageMock.setItem as jest.Mock).mock.calls.slice(-1)[0];
    const key = lastCallArgs[0];
    const value = JSON.parse(lastCallArgs[1]);
    
    expect(key).toBe("mermaidDiagram");
    expect(value.mermaidCode).toBe(newCode);
  });

  it("should generate a valid share URL", () => {
    const { result } = renderHook(() => useDiagramState());
    
    const shareUrl = result.current.generateShareUrl();
    expect(shareUrl).toContain("http://localhost:3000/?data=");
    
    // The URL should contain encoded diagram data
    const dataParam = shareUrl.split("=")[1];
    const decompressed = decompressFromEncodedURIComponent(dataParam);
    const data = JSON.parse(decompressed as string);
    
    expect(data.mermaidCode).toBe(defaultDiagramCode);
    expect(data.settings.theme).toBe("default");
  });
}); 