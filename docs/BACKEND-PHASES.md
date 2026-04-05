# Backend integration — phased plan

This app reads all catalog data through **`src/repositories/`**. Fixtures live in **`src/data/`** and remain the default until APIs are wired.

## Environment

Copy `.env.example` to `.env` locally (not committed). Vite exposes only `VITE_*` variables.

| Variable | Values | Purpose |
|----------|--------|---------|
| `VITE_DATA_MODE` | `dummy` (default), `real`, `hybrid` | Data sourcing strategy |
| `VITE_API_BASE_URL` | e.g. `https://api.lankatrips.lk` | REST API origin (Phase B) |

## Completed: Phase A — Repository layer

- **`src/config/dataMode.ts`** — `getDataMode()`, `getApiBaseUrl()`, `isApiConfigured()`
- **`src/api/client.ts`** — `apiGetJson()` stub for Phase B
- **`src/repositories/*`** — async `load*()` + sync fixture helpers; legacy `getAll*` where not migrated yet
- **UI imports** — pages/components use repositories, not direct `data/` imports (types re-exported where helpful)
- **`src/vite-env.d.ts`** — typing for `import.meta.env`

**Runtime today:** same as before — full fixtures. Setting `VITE_DATA_MODE=real` in development logs a reminder that the API client is not connected yet.

## Phase B — Read APIs (packages) ✅

Implemented:

- **`@tanstack/react-query`** with `QueryProvider` in `main.tsx`.
- **`loadPackages()`** in `repositories/packagesRepository.ts`:
  - `dummy` → fixtures only.
  - `real` / `hybrid` with **`VITE_API_BASE_URL`** → `GET {base}/packages` (JSON array).
  - **Hybrid:** on network/parse error → fixtures + `console.warn`.
  - **Real:** production failure throws (empty/error UI); dev failure falls back to fixtures with warning.
  - No API URL in dev → fixtures + warning.
- **`usePackages()`** / **`usePackage(id)`** — UI reads from the shared query cache.
- **`api/mappers/packageMapper.ts`** — extend when API shape differs from `TourPackage`.
- Package list, featured, highlight, destination related packages, and package detail use async loading states.

**Contract:** `GET /packages` returns a JSON array of objects compatible with `TourPackage` (same fields as `src/data/packages.ts`).

## Phase B2 — Read APIs (destinations & vehicles) ✅

Implemented (same `dummy` / `real` / `hybrid` rules as packages):

- **`loadDestinations()`** → `GET {base}/destinations` — **`useDestinations()`**, **`useDestination(slug)`** (detail + sidebar).
- **`loadVehicles()`** → `GET {base}/vehicles` — **`useVehicles()`** (fleet page, customize, package detail pricing).
- **`api/mappers/destinationMapper.ts`**, **`vehicleMapper.ts`** — extend when API shape differs.
- React Query uses **fixture `placeholderData`** so lists and price breakdowns stay stable while the network request runs.
- **Still fixture-only in repo:** hotels, activities, testimonials (`getAllHotels`, `getAllActivities`, …) — same pattern when you add Phase B3.

**Contracts:** `GET /destinations` and `GET /vehicles` return JSON arrays compatible with `src/data/destinations.ts` and `src/data/vehicles.ts`.

## Next: Phase B3 — Optional catalog entities

- Hotels, activities, testimonials: `load*`, mappers, hooks, wire customize/booking flows that still call sync getters.

## Phase C — Writes & booking

- Quote / booking POST endpoints; confirmation references from server.
- Replace local-only confirmation flow.

## Phase D — Auth, admin, media

- Operator/admin CMS or protected APIs.
- CDN URLs for images; remove reliance on `/public` static shots where needed.

## Phase E — Hardening

- Rate limits, CORS, production monitoring, empty states for `real` mode without fallback.

---

**Rule of thumb:** add new fields to **`src/data/`** and **`repositories/`** together until the API exists; then DTO mapping lives only in repositories.
