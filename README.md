# 🪺 ToolNest
### You searched. You bookmarked. You forgot. **We keep it for you.**

ToolNest is a cozy, production-grade nest of developer utilities. Instead of hunting through browser history for bookmarked tools, everything lives in one permanent, fast, and privacy-focused workspace.

**Visit:** [localhost:3000](http://localhost:3000) (if running locally)

---

## ✨ Features
- **Privacy First:** No login required. Data stays in your browser or is processed in-memory (never stored).
- **Multi-Tab Workspace:** Open multiple instances of any tool simultaneously using our built-in tab system.
- **Dark/Light Mode:** Full theme support with persistence and system-preference detection.
- **Animated Atmosphere:** Beautiful, interactive background that reacts to your presence.
- **Zero Latency:** Most tools run 100% locally in your browser.

---

## 🛠️ The Tool Suite

### 📝 Text & Code
- **MarkSmith:** A premium Markdown editor with side-by-side preview and ghost-gutter line numbers.
- **JSONify:** Format, validate, and beautify messy JSON strings instantly.
- **Diff Editor:** Professional-grade text comparison to find subtle changes between code or text.
- **Cipher Lab:** Encode/Decode anything (Base64, URL, HTML) with zero network calls.
- **Blank Space:** A distraction-free, auto-saving scratchpad for your thoughts.

### ⚙️ Utilities
- **Time Forge:** Seamless conversion between Unix timestamps and human-readable dates.
- **Drawboard:** An infinite virtual whiteboard (powered by Excalidraw) for sketching ideas.

### 📄 PDF Studio (Backend Powered)
- **PDF Merge:** Combine multiple PDF files into a single document in seconds.
- **PDF to Doc:** Extract clean text and structure from any PDF file.
- **PDF to Image:** Convert PDF pages into high-quality PNG images.

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18+)
- **Python** (3.9+)

### 2. Run the Backend (FastAPI)
The backend handles heavy file processing like PDF merging and extraction.
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
python main.py
```
*API Base: http://localhost:8000/api*

### 3. Run the Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```
*App URL: http://localhost:3000*

---

## 🏗️ Architecture
- **Frontend:** Next.js 14, React 18, Tailwind CSS, TypeScript.
- **Backend:** FastAPI (Python), pypdf, pdfplumber, pypdfium2.
- **Deployment:** Ready for Vercel (Frontend) and Render/Railway (Backend).

---

## 🔒 Security & Privacy
- **Client-Side Processing:** Tools like JSONify and Cipher Lab never send your data to any server.
- **In-Memory Backend:** For PDF tools, files are processed entirely in RAM using `io.BytesIO` and are **never written to disk**.

---

## 📄 License
MIT License - Open for developers to nest, build, and grow.
