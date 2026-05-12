# Advanced To-Do App — Portfolio Edition

A **Swiss / Brutalist** to-do app built with **Expo + React Native + Expo Router + Reanimated**. One codebase runs on **iOS, Android, and Web**. All data is stored locally with `AsyncStorage` (uses IndexedDB on web automatically).

---

## ⚡ TL;DR — Quick Commands

```bash
# 1) Install Node.js (LTS) from https://nodejs.org
# 2) Install Yarn (recommended)
npm install -g yarn

# 3) Create a new Expo project (skip if cloning this one)
npx create-expo-app@latest my-todo --template tabs
cd my-todo

# 4) Install the dependencies used in this project
yarn add @react-native-async-storage/async-storage @expo/vector-icons \
         expo-router react-native-reanimated react-native-gesture-handler \
         react-native-safe-area-context react-native-screens

# 5) Run the app
yarn start          # opens Expo Dev Tools (press w for web, i for iOS, a for Android)
yarn web            # web only
yarn android        # Android only (needs Android Studio / device)
yarn ios            # iOS only (needs macOS)
```

> **Tip**: To open on a real phone, install the **Expo Go** app and scan the QR code shown after `yarn start`.

---

## 📁 Project Structure (Aap ko yeh files banani hain)

```
my-todo/
├── app/                                  ← Expo Router (file-based routes)
│   ├── _layout.tsx                       ← Root layout: wraps ThemeProvider + TaskProvider
│   ├── index.tsx                         ← Redirects "/" → "/(tabs)"
│   └── (tabs)/                           ← Bottom-tab group
│       ├── _layout.tsx                   ← Tab bar config
│       ├── index.tsx                     ← Dashboard (Home tab)
│       ├── tasks.tsx                     ← All tasks + search + filters
│       ├── categories.tsx                ← Manage categories
│       ├── stats.tsx                     ← Analytics + chart
│       └── settings.tsx                  ← Theme toggle + Danger zone
│
├── src/                                  ← Everything that is NOT a route
│   ├── constants/
│   │   └── theme.ts                      ← Color tokens (light + dark), spacing, font scale
│   ├── context/
│   │   ├── ThemeContext.tsx              ← Light/Dark theme state + AsyncStorage persistence
│   │   └── TaskContext.tsx               ← Tasks + categories CRUD + AsyncStorage
│   └── components/
│       ├── TaskItem.tsx                  ← Animated task row (checkbox, priority, edit/delete)
│       ├── AddTaskModal.tsx              ← Bottom-sheet form (add / edit)
│       ├── StatCard.tsx                  ← Dashboard stat tile
│       └── EmptyState.tsx                ← Empty placeholder
│
├── app.json                              ← Expo config (name, icons, splash)
├── package.json                          ← Dependencies
└── tsconfig.json                         ← TypeScript config
```

### 🪜 Step-by-Step — Files Banane Ka Order

Easy → Hard sequence follow karein:

1. **`src/constants/theme.ts`** — Saare colors aur spacing yahin define karte hain. Pehle yeh banao.
2. **`src/context/ThemeContext.tsx`** — Light/Dark switch banata hai. `useTheme()` hook export karta hai.
3. **`src/context/TaskContext.tsx`** — Saari business logic: add/edit/delete tasks, categories. `useTasks()` hook.
4. **`src/components/EmptyState.tsx`** — Simplest component pehle, taa-ke confidence aaye.
5. **`src/components/StatCard.tsx`** — Stats screen mein use hota hai.
6. **`src/components/TaskItem.tsx`** — Animated row (checkbox + edit/delete).
7. **`src/components/AddTaskModal.tsx`** — Form modal.
8. **`app/_layout.tsx`** — Sab providers ko wrap karta hai (GestureHandlerRootView → SafeAreaProvider → ThemeProvider → TaskProvider → Stack).
9. **`app/index.tsx`** — `<Redirect href="/(tabs)" />`.
10. **`app/(tabs)/_layout.tsx`** — Bottom tab bar (Home, Tasks, Categories, Stats, Settings).
11. **`app/(tabs)/index.tsx`** — Dashboard screen.
12. **`app/(tabs)/tasks.tsx`** — All tasks + search + filters.
13. **`app/(tabs)/categories.tsx`** — Categories management.
14. **`app/(tabs)/stats.tsx`** — Bar chart + breakdowns.
15. **`app/(tabs)/settings.tsx`** — Theme toggle + clear data.

---

## 🎨 Design System (Swiss / High-Contrast)

| Token       | Light            | Dark              |
|-------------|------------------|-------------------|
| Background  | `#F9F9F7`        | `#0A0A0A`         |
| Surface     | `#FFFFFF`        | `#141414`         |
| Text        | `#111111`        | `#F5F5F5`         |
| Accent      | `#FF3B30` (red)  | `#E2FF3D` (lime)  |
| High        | `#FF3B30`        | `#FF453A`         |
| Medium      | `#FF9500`        | `#FF9F0A`         |
| Low         | `#34C759`        | `#32D74B`         |

- **Sharp edges** (no rounded corners)
- **1px hard borders** everywhere
- **Black font weight** for headlines, **mono labels** with 2 letter-spacing
- **Generous spacing** (8 / 16 / 24 / 32 grid)

---

## ✨ Features

- ✅ Add / Edit / Delete tasks
- ✅ 4 default Categories (Work, Personal, Shopping, Health) + custom
- ✅ Priority (High / Medium / Low)
- ✅ Due dates
- ✅ Search + filters (status, priority, category)
- ✅ Stats dashboard with 7-day bar chart, streak, priority + category breakdowns
- ✅ Light / Dark theme toggle (saved in AsyncStorage)
- ✅ Bottom tab navigation with active-state animation
- ✅ Reanimated micro-interactions (checkbox spring, list stagger, layout transitions)
- ✅ Fully responsive (max-width 720–960 on web, full-bleed on mobile)
- ✅ Local-only storage — no backend, no server costs, deploy-anywhere portfolio piece

---

## 📦 Dependencies Used

```jsonc
{
  "expo": "~54.0.x",
  "expo-router": "~6.0.x",
  "@react-native-async-storage/async-storage": "2.2.0",
  "@expo/vector-icons": "^15",
  "react-native-reanimated": "~4.1",
  "react-native-gesture-handler": "~2.28",
  "react-native-safe-area-context": "~5.6",
  "react-native-screens": "~4.16"
}
```

---

## 🧠 Key Patterns You'll Learn

1. **File-based routing** with Expo Router (`app/` directory).
2. **Route groups** with `(tabs)` for shared layout without affecting URL.
3. **Context + AsyncStorage** for clean state management.
4. **Reanimated 3/4** — `FadeIn`, `Layout`, `SlideInDown`, `useSharedValue`, `withSpring`, `withTiming`.
5. **Single codebase** that compiles to iOS, Android, AND Web via `react-native-web`.
6. **Safe area + KeyboardAvoidingView** for proper mobile UX.
7. **Cross-platform `confirm()`** (uses native `Alert.alert` on mobile, `window.confirm` on web).

---

## 🚀 Deploy / Build

```bash
# Export the static web build (deploy to Vercel, Netlify, GitHub Pages)
npx expo export --platform web
# Output goes to ./dist — point your host at it.

# Native builds (uses Expo EAS — free tier available)
npx eas build --platform android   # produces APK / AAB
npx eas build --platform ios       # produces IPA (requires Apple Dev account)
```

For Emergent users: just click the **Publish** button at the top right — it handles everything.

---

## 🔁 Extending the App (next steps for your portfolio)

- Add **drag-to-reorder** with `react-native-draggable-flatlist`
- Add **notifications** with `expo-notifications` for due-date reminders
- Add **export / import JSON** so users can backup
- Add a **server sync mode** with Firebase / Supabase
- Add **multiple themes** (e.g. solarized, monochrome)

---

Made with ☕ + a love for grid systems.
