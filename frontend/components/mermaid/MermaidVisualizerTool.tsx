import React, { useState, useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import EditorWithLineNumbers from '../markdown/EditorWithLineNumbers';
import Toolbar from '../ui/Toolbar';
import Button from '../ui/Button';
import { Download, RefreshCw, ZoomIn, ZoomOut, Maximize, Printer, Image as ImageIcon, FileCode } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const DEFAULT_CODE = `graph TD
    A[Start] --> B{Is it working?}
    B -- Yes --> C[Great!]
    B -- No --> D[Debug]
    D --> B
`;

export default function MermaidVisualizerTool() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [svgContent, setSvgContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();
  const previewRef = useRef<HTMLDivElement>(null);

  // Initialize mermaid configuration based on theme
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: theme === 'dark' ? 'dark' : 'default',
      securityLevel: 'loose',
      fontFamily: 'Inter, sans-serif',
    });
    renderDiagram(code);
  }, [theme]); // Re-render when theme changes

  // Debounced render
  useEffect(() => {
    const timer = setTimeout(() => {
      renderDiagram(code);
    }, 500);
    return () => clearTimeout(timer);
  }, [code]);

  const renderDiagram = async (mmdCode: string) => {
    if (!mmdCode.trim()) {
      setSvgContent('');
      setError(null);
      return;
    }
    
    try {
      // Create a unique ID for the render
      const id = `mermaid-render-${Date.now()}`;
      const { svg } = await mermaid.render(id, mmdCode);
      setSvgContent(svg);
      setError(null);
    } catch (err: any) {
      // Mermaid throws errors if parsing fails
      setSvgContent('');
      setError(err.message || 'Syntax error in Mermaid code');
    }
  };

  const handleDownloadSvg = () => {
    if (!svgContent) return;
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mermaid-diagram.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPng = () => {
    if (!svgContent) return;
    
    // Parse the SVG content to get an element we can manipulate
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgContent, 'image/svg+xml');
    const svgElement = doc.querySelector('svg');
    if (!svgElement) return;

    // Get intrinsic dimensions from the SVG itself
    const widthAttr = svgElement.getAttribute('width');
    const heightAttr = svgElement.getAttribute('height');
    const viewBox = svgElement.getAttribute('viewBox');
    
    let width = 800;
    let height = 600;

    if (widthAttr && heightAttr && !widthAttr.includes('%') && !heightAttr.includes('%')) {
      width = parseFloat(widthAttr);
      height = parseFloat(heightAttr);
    } else if (viewBox) {
      const parts = viewBox.split(' ');
      if (parts.length === 4) {
        width = parseFloat(parts[2]);
        height = parseFloat(parts[3]);
      }
    }

    // Create canvas with optimized scaling (2x is usually plenty for high quality)
    // We also cap the maximum dimension to 4096px to keep file sizes reasonable
    const MAX_CANVAS_SIZE = 4096;
    let scale = 2;
    
    if (width * scale > MAX_CANVAS_SIZE || height * scale > MAX_CANVAS_SIZE) {
      scale = Math.min(MAX_CANVAS_SIZE / width, MAX_CANVAS_SIZE / height);
    }

    const canvas = document.createElement('canvas');
    canvas.width = Math.floor(width * scale);
    canvas.height = Math.floor(height * scale);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set background
    ctx.fillStyle = theme === 'dark' ? '#0f111a' : '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Ensure the SVG has explicit dimensions for the canvas rendering
    svgElement.setAttribute('width', (width * scale).toString());
    svgElement.setAttribute('height', (height * scale).toString());

    const data = new XMLSerializer().serializeToString(svgElement);
    const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(data);

    const img = new Image();
    img.crossOrigin = 'anonymous'; // Just in case, though usually not needed for data URLs
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const pngUrl = canvas.toDataURL('image/png', 1.0);
      const a = document.createElement('a');
      a.href = pngUrl;
      a.download = 'mermaid-diagram-hd.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };
    img.onerror = () => {
      console.error('Failed to load SVG into image for PNG conversion');
    };
    img.src = url;
  };

  const handleExportPdf = () => {
    if (!svgContent) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to export PDF');
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>ToolNest - Mermaid PDF Export</title>
          <style>
            body { 
              margin: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              background: #ffffff !important;
            }
            svg {
              max-width: 100%;
              max-height: 100vh;
              width: auto;
              height: auto;
            }
            @media print {
              @page { margin: 1cm; size: landscape; }
              body { display: block; }
              svg { max-height: 100%; page-break-inside: avoid; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="no-print" style="position: fixed; top: 0; left: 0; right: 0; background: #3b82f6; color: white; padding: 10px; text-align: center; font-size: 12px; font-weight: bold; font-family: sans-serif; z-index: 9999;">
            PREPARING PROFESSIONAL PDF... THE PRINT DIALOG WILL OPEN AUTOMATICALLY.
          </div>
          ${svgContent}
          <script>
            window.onload = function() {
              setTimeout(() => {
                window.print();
              }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="flex h-full flex-col min-h-0 bg-[var(--bg)] text-[var(--text)]">
      {/* Top Toolbar */}
      <div className="shrink-0 p-4 border-b border-[var(--border)]">
        <Toolbar>
          <div className="flex items-center space-x-2">
            <Button onClick={() => setCode(DEFAULT_CODE)} title="Reset Code">
              <div className="flex items-center gap-2">
                <RefreshCw size={14} />
                <span>Reset</span>
              </div>
            </Button>
          </div>
          
          <div className="flex items-center space-x-2 border-l border-[var(--border)] pl-4 ml-2">
            <Button onClick={handleDownloadSvg} title="Download Source SVG">
              <div className="flex items-center gap-2">
                <FileCode size={14} />
                <span>SVG</span>
              </div>
            </Button>
            <Button onClick={handleDownloadPng} title="Download Ultra-HD PNG">
              <div className="flex items-center gap-2">
                <ImageIcon size={14} />
                <span>HD PNG</span>
              </div>
            </Button>
            <Button onClick={handleExportPdf} title="Export as Vector PDF">
              <div className="flex items-center gap-2">
                <Printer size={14} />
                <span>PDF</span>
              </div>
            </Button>
          </div>
        </Toolbar>
      </div>

      {/* Split Pane */}
      <div className="flex flex-1 min-h-0">
        {/* Editor (Left) */}
        <div className="w-1/2 flex flex-col min-h-0 border-r border-[var(--border)]">
          <div className="flex items-center justify-between px-4 py-2 bg-[var(--bg-elevated)] border-b border-[var(--border)]">
            <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Editor</h3>
            <a 
              href="https://mermaid.js.org/intro/" 
              target="_blank" 
              rel="noreferrer"
              className="text-xs text-[var(--accent)] hover:underline"
            >
              Syntax Guide
            </a>
          </div>
          <EditorWithLineNumbers
            value={code}
            onChange={setCode}
            placeholder="Enter Mermaid code here..."
            className="border-none rounded-none"
          />
        </div>

        {/* Preview (Right) */}
        <div className="w-1/2 flex flex-col min-h-0 bg-[var(--bg-inset)] relative">
          <div className="flex items-center justify-between px-4 py-2 bg-[var(--bg-elevated)] border-b border-[var(--border)] shrink-0 z-10">
            <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Preview</h3>
          </div>
          
          {error ? (
            <div className="flex-1 flex items-center justify-center p-6 min-h-0 overflow-auto">
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-lg w-full max-w-lg font-mono text-sm whitespace-pre-wrap">
                {error}
              </div>
            </div>
          ) : (
            <div className="flex-1 min-h-0 relative overflow-hidden flex items-center justify-center" ref={previewRef}>
              {svgContent && (
                <TransformWrapper
                  initialScale={1}
                  minScale={0.1}
                  maxScale={8}
                  centerOnInit={true}
                  wheel={{ step: 0.1 }}
                >
                  {({ zoomIn, zoomOut, resetTransform }) => (
                    <>
                      {/* Zoom Controls Overlay */}
                      <div className="absolute bottom-6 right-6 flex items-center gap-2 bg-[var(--bg-elevated)] border border-[var(--border)] p-1.5 rounded-lg shadow-xl z-10">
                        <button onClick={() => zoomOut()} className="p-1.5 rounded hover:bg-[var(--bg-hover)] text-[var(--text-muted)] transition-colors" title="Zoom Out">
                          <ZoomOut size={18} />
                        </button>
                        <div className="w-px h-4 bg-[var(--border)] mx-1" />
                        <button onClick={() => resetTransform()} className="p-1.5 rounded hover:bg-[var(--bg-hover)] text-[var(--text-muted)] transition-colors" title="Reset View">
                          <Maximize size={18} />
                        </button>
                        <div className="w-px h-4 bg-[var(--border)] mx-1" />
                        <button onClick={() => zoomIn()} className="p-1.5 rounded hover:bg-[var(--bg-hover)] text-[var(--text-muted)] transition-colors" title="Zoom In">
                          <ZoomIn size={18} />
                        </button>
                      </div>

                      {/* Pan/Zoom Canvas */}
                      <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }} contentStyle={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div 
                          dangerouslySetInnerHTML={{ __html: svgContent }} 
                          className="mermaid-output flex items-center justify-center p-8 max-w-full max-h-full"
                        />
                      </TransformComponent>
                    </>
                  )}
                </TransformWrapper>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
