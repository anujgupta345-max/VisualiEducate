# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**VisualPDF** is a client-side React SPA that lets users upload PDFs, select text, and generate AI-powered diagrams/visualizations using Google's Gemini 2.5 Flash model.

## Commands

```bash
npm run dev       # Start dev server at http://localhost:3000
npm run build     # TypeScript compile + Vite production build
npm run preview   # Serve the production build locally
```

There are no test scripts or linters configured.

## Environment

The app requires a `GEMINI_API_KEY` environment variable. Vite exposes it to the browser via `import.meta.env.VITE_GEMINI_API_KEY` (see `vite.config.ts` for the injection logic).

## Architecture

This is a flat, single-component architecture — almost all logic lives in `App.tsx`:

- **`App.tsx`** — Root component holding all state and UI. Contains inline sub-components (`LoadingOverlay`, `VisualCard`). No routing, no global state library.
- **`services/gemini.ts`** — Thin service layer wrapping `@google/genai`. Exports `generateVisualFromContext(selectedText)` which returns an image URL and explanation.
- **`types.ts`** — Shared TypeScript interfaces (`VisualResult`, `PDFState`) and the `GenerationStatus` enum.

### Key Data Flow

1. User uploads a PDF → rendered in an `<iframe>` with a transparent overlay to capture `window.getSelection()` events.
2. On selection (>5 chars), a floating "Visualize" button appears anchored to the selection bounding rect.
3. Clicking it calls `generateVisualFromContext()` → Gemini API → base64 image URL + explanation text.
4. Result is pushed into a `VisualResult[]` array in state; cards render in a side panel.

### Import Strategy

Dependencies (React, Lucide, Gemini SDK) are loaded via **import maps in `index.html`** from ESM CDN — they are not bundled by Vite. The `vite.config.ts` marks them as external. This means:
- `package.json` dependencies are dev/type references only, not runtime bundles.
- Adding a new runtime dependency requires adding it to both `index.html` import map and `vite.config.ts` externals.

## Conventions

- **Styling:** Tailwind CSS via CDN — use utility classes directly in JSX. No CSS files.
- **Icons:** `lucide-react` components only.
- **TypeScript:** `ES2022` target, `ESNext` modules, `isolatedModules: true`. Path alias `@/*` maps to the project root.
- **Component style:** Functional components with hooks. Sub-components are co-located inside `App.tsx` rather than separate files.
- **Error feedback:** Toast-style in-UI messages for user-facing errors; `console.error` for diagnostic logging.
