# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm start                        # Dev server on port 9000 (webpack-dev-server)
npm start -- --hmr               # Dev server with hot module reload
npm start -- --port 8888         # Dev server on custom port

# Build
npm run build                    # Production build with CSS extraction
npm run build:dev                # Development build with CSS extraction
npm run analyze                  # Production build + bundle analyzer

# Test & Lint
npm test                         # Run Jest tests with coverage
au test --watch                  # Run tests in watch mode

# Docs
npm run generate-docs            # Generate JSDoc documentation
```

## Architecture

**Framework:** Aurelia.js SPA. The app bootstraps in `src/main.js`, sets the root to `src/app.js`, and uses Aurelia's built-in dependency injection throughout.

**Routing:** Centralized in `src/app.js` `configureRouter()`. Routes carry a `settings.roles` array checked by `src/authorize-step.js` before each navigation. Sub-modules define their own nested routers with the same pattern.

**Service layer:** All HTTP and business logic lives in `src/services/`. Services are singletons injected via `@inject()`. The `Http` service wraps `aurelia-fetch-client`; `Auth` handles JWT and opens the Socket.IO connection after login. Barrel export: `src/services/services.js`.

**Modules:** Feature code lives under `src/modules/<feature>/`. Each module class typically implements:
- `configureRouter()` — defines sub-routes
- `activate(params, routeConfig)` — receives route params and sets page title
- `created()` — runs after bindings are ready (safe place to call services)

**Shared resources:** Custom elements and attributes live in `src/resources/` and are globally registered in `src/resources/index.js`. Key ones: `app-header`, `loading-indicator`, `login-signin`, `markdown` (attribute that renders Markdown via Showdown).

**Models:** Plain DTOs in `src/models/`; barrel export at `src/models/models.js`.

**Real-time:** `src/services/auth.js` establishes a Socket.IO connection after login. `src/app.js` listens for submission result events and triggers notifications.

## Configuration

| File | Purpose |
|------|---------|
| `src/config/api.js` | All API endpoint strings — change URLs here, not in services |
| `src/config/messages.js` | All user-facing messages (Spanish) |
| `src/config/environment.json` | Dev environment (`localhost:3000` backend, `debug: true`) |
| `src/config/environment.production.json` | Prod environment (`trainingcenter.cloud.ufps.edu.co`) |
| `webpack.config.js` | Webpack + Aurelia plugin configuration |
| `babel.config.json` | Babel with decorators and class-properties plugins |
| `.eslintrc.json` | ESLint using `babel-eslint` parser |

Environment config is injected at build time; use `npm run build` for prod and `npm start` for dev.

## Key Conventions

- **Dependency injection:** Use `@inject(ServiceA, ServiceB)` decorator on component/service constructors.
- **Endpoints:** Always reference `api.js` constants rather than inlining URL strings in services.
- **Messages:** User-facing strings go in `config/messages.js`, not inline in components.
- **Role access:** Add a `settings: { roles: ['admin', 'coach'] }` object to route config to restrict navigation.
- **Language:** The codebase is mixed English (code) and Spanish (comments, UI strings, route names). New code follows the same convention.
- **Tests:** Jest with `babel-jest`; test files live under `test/unit/`; setup file is `test/jest-pretest.js`.
