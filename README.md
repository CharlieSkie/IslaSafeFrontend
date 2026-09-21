# IslaSafe Admin Web App

The IslaSafe Admin Web App is a React and TypeScript dashboard for monitoring SOS requests, incidents, hazard-map information, evacuation centers, advisories, residents, and weather conditions.

## Requirements

Install the following before running the frontend:

- [Node.js](https://nodejs.org/) 20 or later
- npm (included with Node.js)

## Install dependencies

Open a terminal in the `frontend` folder, then install the packages declared in `package.json`:

```bash
npm install
```

This installs the main application dependencies:

- React and React DOM
- Vite and TypeScript
- Tailwind CSS
- MapLibre GL JS for interactive map views
- Lucide React for icons
- Oxlint for linting

## Environment configuration

Copy `.env.example` to `.env` before connecting the frontend to external services. The local `.env` file is ignored by Git.

```powershell
Copy-Item .env.example .env
```

Set the required values in `.env`:

| Variable | Purpose |
| --- | --- |
| `VITE_API_BASE_URL` | Base URL for the backend API. |
| `VITE_API_TIMEOUT_MS` | API request timeout in milliseconds. |
| `VITE_MAP_TILE_URL` | Primary/satellite map tile URL. |
| `VITE_MAP_STREETS_TILE_URL` | Street-map tile URL used by location detail maps. |
| `VITE_MAP_API_KEY` | Browser-restricted map key, when required by the chosen provider. |
| `VITE_MAP_ATTRIBUTION` | Attribution for the primary map tiles. |
| `VITE_MAP_STREETS_ATTRIBUTION` | Attribution for street-map tiles. |

All frontend configuration is read through `src/config/environment.ts`. Do not place private backend secrets in `VITE_*` variables because Vite exposes them in the browser bundle.

## Run the app locally

From the `frontend` folder, start the Vite development server:

```bash
npm run dev
```

Vite will print the local URL in the terminal, typically `http://localhost:5173`.

If PowerShell prevents `npm` scripts from running, use the Windows command wrapper instead:

```powershell
npm.cmd run dev
```

## Available commands

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the local development server with hot reload. |
| `npm run build` | Type-checks the project and creates a production build in `dist/`. |
| `npm run preview` | Serves the latest production build locally. |
| `npm run lint` | Runs Oxlint checks. |

For PowerShell environments with script-execution restrictions, replace `npm` with `npm.cmd` in the commands above.

## Project structure

```text
frontend/
├── src/
│   ├── components/        # Shared application layout and UI primitives
│   ├── features/          # Feature-based pages, components, and data
│   ├── assets/            # Static frontend assets
│   ├── App.tsx            # Application entry layout and page routing
│   └── main.tsx           # React bootstrap file
├── package.json           # Scripts and frontend dependencies
└── vite.config.ts         # Vite configuration
```

See [the feature directory guide](src/features/README.md) for the location and purpose of each feature module.
