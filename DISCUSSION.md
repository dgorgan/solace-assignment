# Discussion

## Overview

I approached the assignment in three phases: a short discovery pass (before the clock), then two hours of focused implementation across three PRs, ending with brand-aligned UX polish.

---

## Planning & Pre-Work (outside the 2-hour cap)

**~30 minutes (not counted toward the 2 hours).**  
I read the brief, clarified goals, and ran the app locally to see real behavior.

Goals I locked in:
- **Architecture:** FE/BE separation (no server actions), consume API.
- **Scale:** server-side pagination/search/sort; avoid loading huge arrays on the client.
- **UX polish:** raise the bar from a raw table to a branded, accessible UI.
- **Stretch:** consider row virtualization (ultimately removed—see below).

Findings during this spike:
- **Hydration error** from invalid table semantics (`<thead>` missing a `<tr>` wrapper).
- **Broken search** (type mismatches / numeric string assumptions).  
  → Plan: normalize at the API boundary and fix client crash paths.

> In hindsight: I should have **front-loaded brand discovery** (color tokens, font pairing, spacing scale) from the Solace site during this pre-work. I did more of that during PR3, which cost extra time late in the process.

---

## Two-Hour Implementation Window (the work that counts)

**PR1 – Stabilize & normalize (foundation)**  
- Fix hydration (valid `<thead><tr><th>`).  
- Normalize API output: stable `id`, phone stored as digits; format in UI.  
- Add server pagination/search/sort contract + light cache headers.

**PR2 – Data layer & behavior**  
- React Query provider; typed client + hook.  
- **Server-only** filtering/search/sort/pagination (client renders server results).  
- **Debounced URL-driven state**: search uses `router.replace` to avoid history spam (one nav + one API call per pause).  
- Centralized constants (page/pageSize/sort whitelist), error envelope `{ error: { message } }`, and `qsp()` helper.

**PR3 – UX polish (brand-aligned, no virtualization)**  
- Lato (UI) + Playfair (headings); Solace-style deep green + warm gold; white cards.  
- Sticky table header; stable widths with `table-fixed` + `colgroup`.  
- Chips for specialties; non-wrapping phone/years; responsive layout.  
- Accessible sort headers (`aria-sort`), keyboardable controls.

---

## What changed during the work (trade-offs & lessons)

- I initially tried **row virtualization** to demonstrate scale thinking. That was over-ambitious for an HTML `<table>` and caused layout issues. I removed it and kept **server pagination (25/50/100)**, which is ample for UX while preserving semantics and accessibility.  
  **Lesson:** for this use case, **semantic HTML + a11y > premature micro-optimizations**. If we need true virtualization later, render rows as a **div-grid** (not `<tr>`) or use a purpose-built virtualized grid.

- I **should have front-loaded brand tokens** (colors, spacing, typography) during the pre-work. I did more of that in PR3 instead, which cost time late in the process. Next time, I’d extract those tokens **before** coding.

---

## AI-Assisted Development (transparent)

I consulted **four LLMs** (Claude, Gemini, DeepSeek, GPT) on breakdown and prioritization under a 2-hour limit. I merged the best ideas into a three-PR plan and used AI primarily for:
- Component scaffolds and Tailwind utility tuning,
- Responsive patterns and quick refactors.

I kept **human control** over architecture, data flow, and UX decisions (semantics, a11y, trade-offs).

---

## Final deliverable metrics

- **~25 TypeScript files** touched (zero TypeScript errors)
- **Diff:** **+271 / −133**
- **New reusable components:** 6
- **Responsive:** verified across common breakpoints
- **Accessibility:** keyboardable sorting, `aria-sort`, visible focus; basic contrast checks

*(Not claiming formal WCAG certification—this is a pragmatic, time-boxed pass.)*

---

## Follow-ups with more time

**Backend & data**
- Wire **Postgres + Drizzle/Prisma**, add indexes for name/city/specialty.
- Consider **cursor-based pagination** for deep lists.
- Add **schema validation** (Zod/Valibot) and structured error codes.
- Optional: text search via **tsvector + GIN** or trigram for fuzzy matching.

**Performance & caching**
- ETag / If-None-Match on list endpoints; refine **stale-while-revalidate**.
- Request coalescing for identical inflight queries.

**Testing & quality**
- **Playwright** smoke tests (search/sort/paginate/URL persistence).
- Unit tests for API param parsing and utilities (`qsp`, phone formatting).
- CI pipeline: typecheck, lint, test, build gates.

**UX & a11y**
- Extract brand tokens into **Tailwind theme** (colors/spacing/type scale).
- “Go to page” control, loading skeletons, richer empty states.
- Deeper a11y audit (labels, landmarks, reduced motion).

**Observability**
- **Sentry** for FE/BE error tracking.
- Minimal analytics on search terms and zero-result queries.

---

## Time notes (explicit)

- **Pre-work (outside 2h):** ~30 min reading the brief, exploring the repo, and identifying hydration & search issues.  
- **Two-hour window:**  
  - ~50–60 min: PR1 + PR2 (API normalization, React Query data layer, debounced URL state, constants, error envelope).  
  - Remainder: PR3 styling, component extraction, course-correct away from virtualization, brand token pass.

---

## Closing

Priorities: **stabilize → scale on the server → polish**.  
The result is a clean API contract, URL-driven behavior, and a Solace-style interface—delivered within the 2-hour constraint (plus ~30 min pre-work) and ready to extend into a full DB-backed, CI-tested build.
