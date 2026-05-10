# ToolNest Frontend

Next.js, TypeScript, TailwindCSS. A cozy nest of developer tools that run locally. Dark theme with warm amber accent.

## Architecture

### `/components`
- **`ui/`** – Reusable UI primitives: `Button`, `Toolbar`, `Message`, `SectionLabel`, `SplitPanel`. Use these in tools for consistent look and behavior.
- **`layout/`** – `NavBar`, `ToolPageLayout`. Standard tool page = nav + optional title + content.
- **`Layout`** – Default page wrapper (uses `ToolPageLayout`). Use for most tool pages.
- **`CodeEditor`**, **`ToolCard`** – Shared input and home-page card.
- **`<tool>/`** – One folder per tool (e.g. `jsonify/`, `encode/`, `time/`), each with its main tool component.

### `/lib`
Pure logic, no React. Used by tools and tests.
- **`jsonify.ts`** – JSON parse (e.g. `tryParseJson`).
- **`encode.ts`** – Base64/URL encode and decode.
- **`time.ts`** – Timestamp/date parsing and formatting.
- **`file.ts`** – Blob download helper.

### `/hooks`
- **`useToolMessage`** – `[message, setMessage, clearMessage]` for success/error feedback in tools.

### `/types`
Shared types: `ToolMessage`, `Result<T, E>`, etc.

### `/utils`
App-level helpers: `tools` (tool list), `api` (backend client).

## Adding a new tool

1. Add entry to `utils/tools.ts`.
2. Create `components/<name>/<Name>Tool.tsx` using `Button`, `Toolbar`, `SplitPanel`, `SectionLabel`, `CodeEditor` as needed.
3. Put pure logic in `lib/<name>.ts` if useful.
4. Add page in `pages/tools/<name>.tsx` that renders `Layout` + your tool component.
