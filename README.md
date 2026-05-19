Here is the complete guide converted into professional English:

📘 Step-By-Step Guide — How to Build a To-Do App in VS Code
This guide will help you build this app on your laptop from scratch. Just copy the commands and create the files as you go. Total time: ~30 minutes.

🛠 PART 1 — Install Required Software (only once)
1.1 Install Node.js
👉 Go to your browser: https://nodejs.org
👉 Download the "LTS" version (as shown on the green button)
👉 Install it (next-next-next, default settings)

Verify — open terminal/PowerShell and type:

bash

node -v
npm -v
If the version is displayed → ✅ done.

1.2 Install VS Code
👉 Download from https://code.visualstudio.com
👉 Install it

1.3 Install Yarn (recommended, optional)
In the terminal:

bash

npm install -g yarn
1.4 Install Expo Go app to test on Mobile
👉 Install "Expo Go" from the Play Store / App Store on your phone

🚀 PART 2 — Create a New Project
2.1 Go to your desired folder
bash

cd Desktop          
2.2 Create a new Expo project
bash

npx create-expo-app@latest my-todo-app
Press "y" if prompted
It will take 1-2 mins ⏳
2.3 Go into the project folder
bash

cd my-todo-app
2.4 Open in VS Code
bash

code .
(or open VS Code and go to File → Open Folder → select my-todo-app)

📦 PART 3 — Install Dependencies
Open Terminal in VS Code: Ctrl + ~ (back-tick) or from the menu Terminal → New Terminal

Then run this single command:

bash

yarn add @react-native-async-storage/async-storage @expo/vector-icons expo-router react-native-reanimated react-native-gesture-handler react-native-safe-area-context react-native-screens
📁 PART 4 — Create Folder Structure
You need to create only 2 main folders:

4.1 Inside the app/ folder (these are your routes/pages)
In VS Code's left sidebar (Explorer):

Right-click on app/ folder → New File → _layout.tsx
Right-click on app/ folder → New File → index.tsx
Right-click on app/ folder → New Folder → (tabs)
⚠️ Important: With parentheses, type exactly (tabs)
Inside (tabs)/, create these files:
_layout.tsx
index.tsx
tasks.tsx
categories.tsx
stats.tsx
settings.tsx
4.2 Create src/ folder (these are helpers + components)
Right-click on the project root → New Folder → src

Inside src/, create 3 folders:

src/constants/
theme.ts
src/context/
ThemeContext.tsx
TaskContext.tsx
src/components/
TaskItem.tsx
AddTaskModal.tsx
StatCard.tsx
EmptyState.tsx
Final structure you will see:
text

my-todo-app/
├── app/
│   ├── _layout.tsx              ← Root wrapper (providers go here)
│   ├── index.tsx                ← "/" → redirects to "/(tabs)"
│   └── (tabs)/
│       ├── _layout.tsx          ← Bottom tab bar config
│       ├── index.tsx            ← Home / Dashboard screen
│       ├── tasks.tsx            ← All tasks + search + filter
│       ├── categories.tsx       ← Manage categories
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
│       ├── TaskItem.tsx         ← A single task row
│       ├── AddTaskModal.tsx     ← Task add/edit form
│       ├── StatCard.tsx         ← Stat card (Total, Done etc.)
│       └── EmptyState.tsx       ← "No tasks" placeholder
│
├── app.json
├── package.json
└── tsconfig.json
✍️ PART 5 — Add Code to Files (IMPORTANT order)
Follow this exact order — every file is in a dependency-free order:

Order Sequence:
✅ src/constants/theme.ts (First — colors are defined here)
✅ src/context/ThemeContext.tsx
✅ src/context/TaskContext.tsx
✅ src/components/EmptyState.tsx
✅ src/components/StatCard.tsx
✅ src/components/TaskItem.tsx
✅ src/components/AddTaskModal.tsx
✅ app/_layout.tsx
✅ app/index.tsx
✅ app/(tabs)/_layout.tsx
✅ app/(tabs)/index.tsx
✅ app/(tabs)/tasks.tsx
✅ app/(tabs)/categories.tsx
✅ app/(tabs)/stats.tsx
✅ app/(tabs)/settings.tsx
Where to copy the code from?
You have already received the code for the project built in the Emergent preview. Just paste those files into VS Code.

Check the files here (in the preview environment):

/app/frontend/src/constants/theme.ts → your src/constants/theme.ts
/app/frontend/src/context/* → your src/context/*
/app/frontend/src/components/* → your src/components/*
/app/frontend/app/* → your app/*
▶️ PART 6 — Run the App
In VS Code terminal:

bash

yarn start
A QR code and menu will appear:

Button
Action
Press w	Opens in browser (web preview)
Press a	Android emulator (if setup)
Press i	iOS simulator (Mac only)
QR scan	Scan with Expo Go app on your phone → runs directly on mobile

🐛 PART 7 — Common Problems and Solutions
Problem 1: Cannot find module 'expo-router'
Solution: Run yarn add expo-router

Problem 2: White screen on load
Solution: Check the terminal for errors. It's mostly a typing mistake in the file path.

Problem 3: Unable to resolve "@/..."
Solution: You are using relative paths (../../src/...) — that's completely fine. No need to change the code.

Problem 4: Reanimated animations not working
Solution: You need to add a plugin inside babel.config.js:

js

module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-reanimated/plugin'],   
  };
};
Then close the terminal and run yarn start --clear.

Problem 5: QR scanned via Expo Go on phone but app is not running
Solution: Make sure your laptop and phone are on the same WiFi network.

🎯 PART 8 — Purpose of Files (Quick Reference)
File
Purpose
app/_layout.tsx	Root of the app. ThemeProvider + TaskProvider are wrapped here.
app/index.tsx	Redirects to /(tabs) as soon as the app opens.
app/(tabs)/_layout.tsx	Bottom tab bar design — which icon on which tab.
app/(tabs)/index.tsx	Dashboard — stats + recent tasks + NEW TASK button.
app/(tabs)/tasks.tsx	List of all tasks + search + filter chips.
app/(tabs)/categories.tsx	Categories add/edit/delete + progress bars.
app/(tabs)/stats.tsx	7-day bar chart + streak + priority/category breakdown.
app/(tabs)/settings.tsx	Light/Dark toggle + Clear all data.
src/constants/theme.ts	All colors, spacing, font sizes — change from one place.
src/context/ThemeContext.tsx	Theme state — exports useTheme() hook.
src/context/TaskContext.tsx	Tasks data + AsyncStorage save/load — useTasks() hook.
src/components/TaskItem.tsx	A single task row (checkbox + title + edit/delete).
src/components/AddTaskModal.tsx	Popup form to add/edit a task.
src/components/StatCard.tsx	Dashboard stat boxes (Total, Done, etc.).
src/components/EmptyState.tsx	When the list is empty, shows the "Start your first task" empty box.

🎨 PART 9 — Customization Tips
Want to change colors?
👉 Open src/constants/theme.ts
👉 Change accentPrimary in lightColors or darkColors
👉 Save →

Want to add another tab?
Create a new file in app/(tabs)/: notes.tsx
Add <Tabs.Screen name="notes" options={{ title: "Notes" }} /> in app/(tabs)/_layout.tsx
It will automatically appear in the tab bar 🎉
Want to add a new feature (like a reminder)?
Add reminderTime?: string to the Task interface in src/context/TaskContext.tsx
Add an input field in AddTaskModal.tsx
That's it 👌
🚢 PART 10 — Deploy the App (Optional)
Deploy on Web:
bash

npx expo export --platform web
Mobile on Play Store / App Store:
Use Emergent's Publish button (easiest way).
Or manually: npx eas build --platform android

💡 Bonus
Add this to your portfolio:

"Built an advanced cross-platform To-Do app using Expo + React Native + Expo Router. Single codebase deploys to iOS, Android, and Web. Features include category management, priority levels, due dates, search & filters, statistics dashboard with 7-day chart, light/dark theme toggle, and Reanimated micro-interactions. All data persisted with AsyncStorage. Designed with a professional Swiss-inspired UI."

✅ Final Checklist
 Node.js + Yarn installed
 VS Code installed
 Expo Go app on phone (mobile testing)
 my-todo-app folder created
 All dependencies installed
 Folder structure created (app/, src/)
 All 15 files created and code pasted
 App is running with yarn start
 Tested on Phone / browser
Got stuck?

bash

yarn start --clear
Happy coding! 🚀



