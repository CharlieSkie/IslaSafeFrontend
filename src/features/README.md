# Feature directory guide

Each feature owns its page, feature-specific components, and local mock data. Shared elements remain outside feature folders only when they are used by multiple features.

For dependency installation and commands to run the frontend, see the [frontend setup guide](../../README.md).

| Feature | Purpose |
| --- | --- |
| `auth` | Sign-in, sign-up, and the cinematic entry animation. |
| `dashboard` | Dashboard page and dashboard-only cards and panels. |
| `sos` | SOS request list, request detail dialog, and SOS records. |
| `hazard-map` | Hazard-map page, map controls, and map-layer data. |
| `evacuation` | Evacuation-center page, center cards/dialog, and center data. |
| `incidents` | Incident-monitoring page and incident records. |
| `advisories` | Advisory page and advisory records. |
| `residents` | Resident-list page and resident records. |
| `weather` | Automated Weather Station page. |
| `reports` | Reports and analytics page. |
| `settings` | Administrator settings page. |
| `shared` | Reusable feature-level components and utilities. |

App-wide layout and reusable UI primitives belong in `src/components/layout` and `src/components/ui` respectively.
