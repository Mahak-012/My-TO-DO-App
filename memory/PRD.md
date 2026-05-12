# Product Requirements — Advanced To-Do App (Portfolio)

## Goal
Showcase-grade To-Do application built with Expo (web + iOS + Android from a single codebase). Frontend-only with local persistence — designed as a portfolio centerpiece.

## Stack
- Expo SDK 54 + Expo Router (file-based routing)
- React Native + react-native-web
- react-native-reanimated 4 for animations
- AsyncStorage for persistence (IndexedDB on web)
- TypeScript

## Theme
Swiss / High-Contrast (Brutalist editorial). Dual mode:
- Light: cream bg, red accent (#FF3B30)
- Dark: black bg, neon-lime accent (#E2FF3D)
Sharp 1px borders, no rounded corners, black-weight headlines, mono labels.

## Routes
| Route | Purpose |
|---|---|
| `/` | Redirects to `/(tabs)` |
| `/(tabs)` | Dashboard with hero stats, recent tasks, NEW TASK CTA |
| `/(tabs)/tasks` | Full task list with search + status/priority/category filters |
| `/(tabs)/categories` | Manage categories (add/edit/delete + per-category progress) |
| `/(tabs)/stats` | 7-day completion chart, streak, priority + category breakdowns |
| `/(tabs)/settings` | Theme toggle + clear-all danger zone |

## Data Model (localStorage)
```ts
Task { id, title, notes?, completed, priority: 'high'|'medium'|'low', categoryId, dueDate?, createdAt, completedAt?, order }
Category { id, name, color }
```

## Key Features
- CRUD tasks with priority, category, due date, notes
- Category CRUD with per-category color + progress bar
- Live search + status/priority/category filters
- 7-day completion bar chart
- Streak counter
- Light/Dark theme (persisted)
- Animated task list (Reanimated layout transitions, stagger entrance, spring checkbox)
- Cross-platform confirm dialogs (Alert on native, window.confirm on web)
- Responsive (max-width 720–960 on web, full-bleed on mobile)
- Bottom tab navigation with active-state borders

## Out of scope
- Backend / auth / sync (local only by design)
- Push notifications (future extension)
- Drag-to-reorder (future extension)
