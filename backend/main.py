from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
import io
import base64
import pdfplumber
import pypdf
import pypdfium2

app = FastAPI(title="ToolNest API", version="1.0.0")

# Allow CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/tools/list")
async def list_tools():
    tools = [
        "jsonify",
        "diff",
        "encode",
        "time",
        "markdown",
        "scratchpad",
        "drawboard",
        "pdf-studio"
    ]
    return {
        "tools": tools,
        "version": "1.0.0"
    }

@app.get("/api/tools/health")
async def health():
    return {"status": "UP", "service": "ToolNest Backend (FastAPI)"}

@app.post("/api/pdf/extract")
async def extract_pdf(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="File must be a PDF")
    
    try:
        content = await file.read()
        extracted_text = ""
        with pdfplumber.open(io.BytesIO(content)) as pdf:
            pages = len(pdf.pages)
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    extracted_text += text + "\n\n"
        
        return {
            "filename": file.filename,
            "pages": pages,
            "text": extracted_text.strip()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/pdf/merge")
async def merge_pdfs(files: list[UploadFile] = File(...)):
    if len(files) < 2:
        raise HTTPException(status_code=400, detail="Provide at least two PDFs to merge")
    
    try:
        merger = pypdf.PdfWriter()
        for file in files:
            if not file.filename.lower().endswith(".pdf"):
                raise HTTPException(status_code=400, detail="All files must be PDFs")
            content = await file.read()
            merger.append(io.BytesIO(content))
        
        output_pdf = io.BytesIO()
        merger.write(output_pdf)
        merger.close()
        
        output_pdf.seek(0)
        return Response(
            content=output_pdf.read(),
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=merged.pdf"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/pdf/to-images")
async def pdf_to_images(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="File must be a PDF")
    
    try:
        content = await file.read()
        pdf = pypdfium2.PdfDocument(content)
        images_b64 = []
        
        for page_index in range(len(pdf)):
            page = pdf[page_index]
            # Render at 150 DPI for good quality without huge file sizes
            bitmap = page.render(scale=150/72)
            pil_image = bitmap.to_pil()
            
            buf = io.BytesIO()
            pil_image.save(buf, format="PNG")
            buf.seek(0)
            images_b64.append(base64.b64encode(buf.read()).decode("utf-8"))
        
        pdf.close()
        return {"filename": file.filename, "pages": len(images_b64), "images": images_b64}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
