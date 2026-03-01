# Vue3 + TypeScript Admin Dashboard

Based on Vue 3, TypeScript, Vite, Element Plus, Pinia, and Axios.

## Features

- **Vue 3**: Composition API with script setup.
- **TypeScript**: Strict type checking.
- **Vite**: Fast development and build.
- **Element Plus**: UI component library.
- **Pinia**: State management with persistence.
- **Vue Router**: Dynamic routing and permission control.
- **Axios**: HTTP client with interceptors.
- **ECharts**: Data visualization.
- **Performance**: Route lazy loading, NProgress, build optimization.
- **Code Quality**: ESLint, Prettier.

## Project Setup

```bash
npm install
```

### Compiles and Hot-Reloads for Development

```bash
npm run dev
```

### Type-Check, Compile and Minify for Production

```bash
npm run build
```

## Directory Structure

```
src/
  api/          # API interfaces
  assets/       # Static assets
  components/   # Global components
  composables/  # Composable functions (hooks)
  directives/   # Custom directives
  layouts/      # Layout components
  router/       # Routing configuration
  stores/       # Pinia stores
  types/        # TypeScript type definitions
  views/        # Page views
  App.vue       # Root component
  main.ts       # Entry point
```

## Environment Variables

- `.env.development`: Development environment configuration.
- `.env.production`: Production environment configuration.

## Key Modules

### Permission Control

- **Route Guard**: `src/router/permission.ts` checks token and roles.
- **Directive**: `v-permission="['admin']"` for button-level access.
- **Store**: `src/stores/permission.ts` generates accessible routes.

### HTTP Requests

- **Interceptors**: `src/api/request.ts` handles request/response interception.
- **Mock Data**: Simulated backend responses for development.

### Dashboard

- **Charts**: Encapsulated ECharts components in `src/components/Charts`.
- **Data**: Mock data provided in `src/api/dashboard.ts`.

## Deployment

1. Build the project: `npm run build`
2. Upload the `dist` directory to your web server (Nginx, Apache, etc.).
3. Configure your server to handle SPA routing (redirect 404 to index.html).

Example Nginx config:

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```
