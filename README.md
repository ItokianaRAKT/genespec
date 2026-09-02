# GeneSpec

A visual OpenAPI 3.0 specification editor built with React 19 & TypeScript. Create, edit, import, and export OpenAPI specs through an intuitive GUI with live YAML preview. Data persisted in localStorage.

## Features

- **Visual Spec Editor** — Build OpenAPI specs interactively without writing YAML by hand
- **Dark/Light Theme** — Toggle between dark and light modes, preference persisted in localStorage
- **Live YAML Preview** — Real-time generated YAML output as you edit
- **Export & Copy** — Download the spec as a `.yaml` file or copy it to clipboard
- **Import YAML** — Paste raw OpenAPI YAML to import and edit existing specs
- **Auto-Save** — Spec data automatically saved to localStorage, survives page refreshes

### Pages

| Page | Description |
|------|-------------|
| **Overview** | Dashboard with endpoint/schema/server/tag counts and method distribution |
| **Info** | Edit API title, description, version, contact, and license |
| **Servers** | Add, edit, and remove server URLs |
| **Security** | Configure security schemes (HTTP, API Key, OAuth2, OpenID Connect) |
| **Tags** | Manage API tags with name and description |
| **Endpoints** | Full CRUD for endpoints with parameters, request bodies, and responses |
| **Schemas** | Define schemas with typed properties, defaults, and required flags |

## Tech Stack

- **React 19** with TypeScript
- **Vite** for fast builds
- **Tailwind CSS v4** for styling
- **js-yaml** for YAML parsing
- CSS custom properties for theming (dark/light)

## Getting Started

```bash
# Clone the repository
git clone https://github.com/itokianarakt/genespec.git
cd genespec

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── ConfirmContext.tsx    # Confirmation dialog context
│   │   ├── ConfirmToast.tsx     # Modal confirmation overlay
│   │   ├── ErrorBoundary.tsx    # React error boundary
│   │   ├── Sidebar.tsx          # Navigation sidebar
│   │   └── YamlPreview.tsx      # Live YAML output panel
│   ├── contexts/
│   │   └── ThemeContext.tsx      # Dark/light theme provider
│   ├── hooks/
│   │   └── useSpecEditor.ts     # Core state management
│   ├── models/
│   │   └── openapi.ts           # TypeScript interfaces
│   ├── pages/
│   │   ├── OverviewPage.tsx
│   │   ├── InfoPage.tsx
│   │   ├── ServersPage.tsx
│   │   ├── SecurityPage.tsx
│   │   ├── TagsPage.tsx
│   │   ├── EndpointsPage.tsx
│   │   └── SchemasPage.tsx
│   ├── services/
│   │   ├── mockData.ts          # Default spec data
│   │   ├── yamlGenerator.ts     # YAML serializer
│   │   └── yamlParser.ts        # YAML parser
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.js
```

## Persistence

Data is stored in the browser's localStorage:

| Key | Content |
|-----|---------|
| `genespec-spec` | The full OpenAPI spec (JSON) |
| `genespec-active-section` | Last active page |
| `genespec-theme` | Theme preference (dark/light) |
