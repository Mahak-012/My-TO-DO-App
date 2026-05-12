# 📘 Step-By-Step Guide — VS Code Mein To-Do App Kaise Banayein

Yeh guide aap ko **zero se** apne laptop par yeh app banane mein help karega. Bas commands copy karein aur files banate jayein. Total time: **~30 minutes**.

---

## 🛠 PART 1 — Zaroori Software Install Karein (sirf ek baar)

### 1.1 Node.js install karein
👉 Browser mein jayein: **https://nodejs.org**
👉 "LTS" version download karein (jaisa green button par likha hai)
👉 Install karein (next-next-next, default settings)

Verify karein — terminal/PowerShell kholain aur likhein:
```bash
node -v
npm -v
```
Agar version dikh raha hai → ✅ done.

### 1.2 VS Code install karein
👉 **https://code.visualstudio.com** se download karein
👉 Install karein

### 1.3 Yarn install karein (recommended, optional)
Terminal mein:
```bash
npm install -g yarn
```

### 1.4 Mobile mein test karne ke liye Expo Go app install karein
👉 Phone par **Play Store / App Store** se "Expo Go" install karein

---

## 🚀 PART 2 — Naya Project Banayein

### 2.1 Apni desired folder mein jayein
```bash
cd Desktop          # ya jaha bhi project banana hai
```

### 2.2 Naya Expo project create karein
```bash
npx create-expo-app@latest my-todo-app
```
- Prompt aaye to **"y"** dabayein
- 1-2 min lagega ⏳

### 2.3 Project folder mein jayein
```bash
cd my-todo-app
```

### 2.4 VS Code mein kholain
```bash
code .
```
(ya VS Code khol ke File → Open Folder → my-todo-app select karein)

---

## 📦 PART 3 — Dependencies Install Karein

VS Code mein **Terminal** kholain: `Ctrl + ~` (back-tick) ya menu se `Terminal → New Terminal`

Phir yeh **ek hi command** chalayein:

```bash
yarn add @react-native-async-storage/async-storage @expo/vector-icons expo-router react-native-reanimated react-native-gesture-handler react-native-safe-area-context react-native-screens
```

> ⏳ 1-2 minute lagega. Yeh saari libraries ek saath install ho jayengi.

---

## 📁 PART 4 — Folder Structure Banayein

Aap ko **bas 2 main folders** banane hain:

### 4.1 `app/` folder ke andar (yeh aap ke routes/pages hain)

VS Code ke left sidebar (Explorer) mein:

1. `app/` folder par right-click → **New File** → `_layout.tsx`
2. `app/` folder par right-click → **New File** → `index.tsx`
3. `app/` folder par right-click → **New Folder** → `(tabs)`  
   ⚠️ **Important:** Parentheses ke saath, exactly `(tabs)` likhein
4. `(tabs)/` ke andar yeh files banayein:
   - `_layout.tsx`
   - `index.tsx`
   - `tasks.tsx`
   - `categories.tsx`
   - `stats.tsx`
   - `settings.tsx`

### 4.2 `src/` folder banayein (yeh helpers + components hain)

Project root par right-click → **New Folder** → `src`

`src/` ke andar 3 folders banayein:

#### `src/constants/`
- `theme.ts`

#### `src/context/`
- `ThemeContext.tsx`
- `TaskContext.tsx`

#### `src/components/`
- `TaskItem.tsx`
- `AddTaskModal.tsx`
- `StatCard.tsx`
- `EmptyState.tsx`

### Final structure jo aap ko dikhega:

```
my-todo-app/
├── app/
│   ├── _layout.tsx              ← Root wrapper (providers daalte hain)
│   ├── index.tsx                ← "/" → "/(tabs)" pe bhejta hai
│   └── (tabs)/
│       ├── _layout.tsx          ← Bottom tab bar config
│       ├── index.tsx            ← Home / Dashboard screen
│       ├── tasks.tsx            ← All tasks + search + filter
│       ├── categories.tsx       ← Categories manage karein
│       ├── stats.tsx            ← Charts + analytics
│       └── settings.tsx         ← Theme + clear data
│
├── src/
│   ├── constants/
│   │   └── theme.ts             ← Colors + spacing + font sizes
│   ├── context/
│   │   ├── ThemeContext.tsx     ← Light/Dark theme state
│   │   └── TaskContext.tsx      ← Tasks data + AsyncStorage
│   └── components/
│       ├── TaskItem.tsx         ← Ek task row
│       ├── AddTaskModal.tsx     ← Task add/edit form
│       ├── StatCard.tsx         ← Stat card (Total, Done etc.)
│       └── EmptyState.tsx       ← "No tasks" placeholder
│
├── app.json
├── package.json
└── tsconfig.json
```

---

## ✍️ PART 5 — Files ka Code Daalein (IMPORTANT order)

Yeh **exact order** follow karein — har file dependency-free order mein:

### Order Sequence:

1. ✅ `src/constants/theme.ts` (sab se pehle — colors define hote hain)
2. ✅ `src/context/ThemeContext.tsx`
3. ✅ `src/context/TaskContext.tsx`
4. ✅ `src/components/EmptyState.tsx`
5. ✅ `src/components/StatCard.tsx`
6. ✅ `src/components/TaskItem.tsx`
7. ✅ `src/components/AddTaskModal.tsx`
8. ✅ `app/_layout.tsx`
9. ✅ `app/index.tsx`
10. ✅ `app/(tabs)/_layout.tsx`
11. ✅ `app/(tabs)/index.tsx`
12. ✅ `app/(tabs)/tasks.tsx`
13. ✅ `app/(tabs)/categories.tsx`
14. ✅ `app/(tabs)/stats.tsx`
15. ✅ `app/(tabs)/settings.tsx`

### Code kahan se copy karein?

Emergent preview mein jo project bana hai uska code aap ko already mil chuka hai. Bas un files ko VS Code mein paste kar dein.

**Files yahan dekhein** (preview environment mein):
- `/app/frontend/src/constants/theme.ts` → aap ki `src/constants/theme.ts`
- `/app/frontend/src/context/*` → aap ki `src/context/*`
- `/app/frontend/src/components/*` → aap ki `src/components/*`
- `/app/frontend/app/*` → aap ki `app/*`

> 💡 **Tip:** Github par push karein "Save to Github" button se → phir clone karein local pe. Yeh sab se asaan tareeqa hai.

---

## ▶️ PART 6 — App Chalayein

VS Code terminal mein:

```bash
yarn start
```

Ek QR code aur menu dikhega:

| Button | Kaam |
|---|---|
| Press **`w`** | Browser mein khulega (web preview) |
| Press **`a`** | Android emulator (agar setup hai) |
| Press **`i`** | iOS simulator (sirf Mac par) |
| **QR scan** | Phone mein Expo Go app se scan karein → directly mobile pe chalega |

---

## 🐛 PART 7 — Common Problems aur Solutions

### Problem 1: `Cannot find module 'expo-router'`
**Solution:** `yarn add expo-router` chala dein

### Problem 2: White screen on load
**Solution:** Terminal mein error dekhein. Mostly typing mistake hai file path mein.

### Problem 3: `Unable to resolve "@/..."`
**Solution:** Aap relative paths use kar rahe ho (`../../src/...`) — bilkul theek hai. Code change nahi karna.

### Problem 4: Reanimated animations kaam nahi kar rahi
**Solution:** `babel.config.js` ke andar plugin add karna padta hai:
```js
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-reanimated/plugin'],   // ← yeh line
  };
};
```
Phir terminal close karke `yarn start --clear` chalayein.

### Problem 5: Phone par Expo Go se QR scan ho gaya but app nahi chal raha
**Solution:** Laptop aur phone **same WiFi** par hain ye check karein.

---

## 🎯 PART 8 — Files ka Kaam (Quick Reference)

| File | Kya Karta Hai? |
|---|---|
| `app/_layout.tsx` | Pure app ka **root**. ThemeProvider + TaskProvider yahan wrap hote hain. |
| `app/index.tsx` | App khulte hi `/(tabs)` par redirect karta hai. |
| `app/(tabs)/_layout.tsx` | **Bottom tab bar** ka design — kis tab par kya icon. |
| `app/(tabs)/index.tsx` | **Dashboard** — stats + recent tasks + NEW TASK button. |
| `app/(tabs)/tasks.tsx` | Saari tasks ki list + search + filter chips. |
| `app/(tabs)/categories.tsx` | Categories add/edit/delete + progress bars. |
| `app/(tabs)/stats.tsx` | 7-day bar chart + streak + priority/category breakdown. |
| `app/(tabs)/settings.tsx` | Light/Dark toggle + Clear all data. |
| `src/constants/theme.ts` | Saare colors, spacing, font sizes — **ek hi jagah** se change karein. |
| `src/context/ThemeContext.tsx` | Theme state — `useTheme()` hook export karta hai. |
| `src/context/TaskContext.tsx` | Tasks ka data + AsyncStorage save/load — `useTasks()` hook. |
| `src/components/TaskItem.tsx` | Ek task ki row (checkbox + title + edit/delete). |
| `src/components/AddTaskModal.tsx` | Task add/edit ka **popup form**. |
| `src/components/StatCard.tsx` | Dashboard ke stat boxes (Total, Done etc.). |
| `src/components/EmptyState.tsx` | Jab list khali ho to "Start your first task" wala empty box. |

---

## 🎨 PART 9 — Customization Tips

### Color change karna hai?
👉 `src/constants/theme.ts` open karein
👉 `lightColors` ya `darkColors` mein `accentPrimary` ki value change karein
👉 Save → app refresh hote hi naya color dikh jayega

### Aur ek nayi tab add karni hai?
1. `app/(tabs)/` mein naya file banayein: `notes.tsx`
2. `app/(tabs)/_layout.tsx` mein `<Tabs.Screen name="notes" options={{ title: "Notes" }} />` add karein
3. Tab bar mein automatically aa jayega 🎉

### Naya feature add karna hai (jaise reminder)?
1. `src/context/TaskContext.tsx` ke `Task` interface mein `reminderTime?: string` add karein
2. `AddTaskModal.tsx` mein input field add karein
3. Bus 👌

---

## 🚢 PART 10 — App Deploy Karna (Optional)

### Web pe deploy:
```bash
npx expo export --platform web
# Output `dist/` folder mein aata hai
# Vercel / Netlify par upload karein → live URL mil jayega
```

### Mobile pe Play Store / App Store:
Emergent ki **Publish button** use karein (sab se asaan).
Ya manually: `npx eas build --platform android`

---

## 💡 PART 11 — Aap Ke Liye Bonus

Apni portfolio mein add karte waqt yeh likhein:

> "Built an advanced cross-platform To-Do app using **Expo + React Native + Expo Router**. Single codebase deploys to **iOS, Android, and Web**. Features include category management, priority levels, due dates, search & filters, statistics dashboard with 7-day chart, light/dark theme toggle, and Reanimated micro-interactions. All data persisted with AsyncStorage. Designed with a professional Swiss-inspired UI."

---

## ✅ Final Checklist

- [ ] Node.js + Yarn installed
- [ ] VS Code installed
- [ ] Expo Go app on phone (mobile testing)
- [ ] `my-todo-app` folder created
- [ ] All dependencies installed
- [ ] Folder structure created (`app/`, `src/`)
- [ ] All 15 files created and code pasted
- [ ] `yarn start` se app chal raha hai
- [ ] Phone / browser pe test ho gaya

---

**Got stuck? Yeh terminal mein chalayein:**
```bash
yarn start --clear
```
99% problems isse solve ho jaati hain 😄

Happy coding! 🚀
