import { createShareableUrl } from "@/lib/helpers";
import type { MermaidTheme } from "@/lib/types";

/**
 * Format filename to display name
 */
export function formatExampleName(filename: string): string {
  // Remove file extension and convert kebab case to title case
  return filename
    .replace('.mermaid', '')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Load mermaid example content at runtime
 */
export async function loadMermaidExample(filename: string): Promise<string> {
  try {
    const response = await fetch(`/examples/${filename}`);
    if (!response.ok) {
      throw new Error(`Failed to load example: ${filename}`);
    }
    return await response.text();
  } catch (error) {
    console.error(`Error loading mermaid example: ${filename}`, error);
    return '';
  }
}

/**
 * Create a shareable URL from mermaid code and theme
 */
export function createExampleShareableUrl(mermaidCode: string, theme: MermaidTheme = 'default'): string {
  return createShareableUrl(mermaidCode, theme);
}

/**
 * Fetch the list of available mermaid examples from the API
 */
export async function fetchMermaidExamples(): Promise<string[]> {
  try {
    const response = await fetch('/api/examples');
    if (!response.ok) {
      throw new Error('Failed to fetch mermaid examples');
    }
    const data = await response.json();
    return data.examples;
  } catch (error) {
    console.error('Error fetching mermaid examples:', error);
    return [];
  }
} 