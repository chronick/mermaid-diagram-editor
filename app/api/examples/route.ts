import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const examplesDirectory = path.join(process.cwd(), 'public/examples');
    const files = await fs.readdir(examplesDirectory);
    
    // Filter for .mermaid files only
    const mermaidFiles = files.filter(file => file.endsWith('.mermaid'));
    
    return NextResponse.json({ examples: mermaidFiles });
  } catch (error) {
    console.error('Error fetching mermaid examples:', error);
    return NextResponse.json(
      { error: 'Failed to fetch mermaid examples' },
      { status: 500 }
    );
  }
} 