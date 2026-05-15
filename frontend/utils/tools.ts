export const TOOLS = [
  { id: 'jsonify', name: 'JSONify', description: 'Format and validate JSON.', href: '/tools/jsonify' },
  { id: 'diff', name: 'Diff Editor', description: 'Compare text and code.', href: '/tools/diff' },
  { id: 'encode', name: 'Cipher Lab', description: 'Encode and decode text.', href: '/tools/encode' },
  { id: 'time', name: 'Time Forge', description: 'Timestamp and date conversions.', href: '/tools/time' },
  { id: 'markdown', name: 'MarkSmith', description: 'Markdown editor.', href: '/tools/markdown' },
  { id: 'scratchpad', name: 'Blank Space', description: 'Distraction-free scratchpad.', href: '/tools/scratchpad' },
  { id: 'drawboard', name: 'Drawboard', description: 'Infinite drawing canvas.', href: '/tools/drawboard' },
  { id: 'mermaid', name: 'Mermaid Visualizer', description: 'Convert MMD code into beautiful diagrams.', href: '/tools/mermaid' },
  { id: 'pdf-merge', name: 'PDF Merge', description: 'Combine multiple PDFs into one file.', href: '/tools/pdf-merge' },
  { id: 'pdf-to-doc', name: 'PDF to Doc', description: 'Extract text and content from any PDF.', href: '/tools/pdf-to-doc' },
  { id: 'pdf-to-image', name: 'PDF to Image', description: 'Convert PDF pages to PNG images.', href: '/tools/pdf-to-image' },
] as const;

export type ToolId = (typeof TOOLS)[number]['id'];
