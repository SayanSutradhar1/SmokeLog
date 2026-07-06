# SmokeLog 🚭

SmokeLog is a mobile-first **mindful nicotine reduction** application built using **Expo**, **React Native**, and **TypeScript**. Its goal is to help users break subconscious habit loops by creating behavioral friction (logging), expanding the gap between smokes, and tracking mathematical trajectory control over time.

---

## 🚀 Key Features

* **Dynamic Gap Tracker**: Tracks time elapsed since the last cigarette in real-time, displays daily progress towards dynamic target gaps, and offers a **Box Breathing** exercise to help users survive intense cravings.
* **Control Dashboard**: Visualizes the user's progress trajectory (e.g. *Excellent*, *Steady*, *Slipping*), habit control score (0-100), trigger analytics, and defines all metric behaviors.
* **Logs History**: Flat list of past smokes showing chronological trigger distribution (e.g. *Stress*, *Boredom*, *Routine*) and offering sliding delete actions.
* **Financial & Health Recovery**: Monitors accumulated monetary savings, cigarettes skipped, and physiological progress checkpoints (oxygen levels, nicotine decay, lung healing) based on smoke-free offsets.
* **Custom Configurations**: Flexible setup of baseline habits (cigarettes per day, pack pricing, currency) and customizable reduction pace tracks (*Gentle*, *Moderate*, *Aggressive*).

---

## 🛠️ Technology Stack

* **Framework**: [Expo](https://expo.dev) (v57.0.0 SDK)
* **Routing & Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/) (File-based tabs layout)
* **Language**: [TypeScript](https://www.typescript.org/)
* **Animations**: [React Native Reanimated](https://docs.expo.dev/versions/latest/sdk/reanimated/) (Box breathing spring sequences)
* **Icons**: [Lucide React Native](https://lucide.dev/)
* **Persistence**: [@react-native-async-storage/async-storage](https://react-native-async-storage.github.io/async-storage/)

---

## 📂 Project Structure

```
src/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx       # Bottom tabs navigation configurations
│   │   ├── dashboard.tsx     # Behavioral overview, stats & glossary
│   │   ├── index.tsx         # Gap Tracker (counter, log, box breathing)
│   │   ├── history.tsx       # List of logs & trigger breakdowns
│   │   ├── savings.tsx       # Financial savings & health metrics
│   │   └── settings.tsx      # User baseline & Reduction speed setup
│   └── _layout.tsx           # App entry, context wrapper, & Onboarding gate
├── components/
│   ├── dashboard/            # Subcomponents for Dashboard screen
│   ├── tracker/              # Subcomponents for Gap Tracker screen
│   ├── history/              # Subcomponents for Logs History screen
│   ├── savings/              # Subcomponents for Stats & Health screen
│   └── settings/             # Subcomponents for Settings configuration
├── context/
│   └── SmokeContext.tsx      # Global state provider
├── hooks/
│   ├── useSmoke.ts           # Custom hook consuming SmokeContext
│   └── useResponsive.ts      # Screen size hook (mobile/tablet/wide layout sizing)
└── utils/
    ├── gapAnalysis.ts        # Algorithmic analytics & GapAnalyzer class
    └── storage.ts            # AsyncStorage static wrapper & StorageManager class
```

For a detailed breakdown of core modules and data mutation flows, please check [ARCHITECTURE.md](ARCHITECTURE.md).

For AI development guidelines and project configurations, please check [AGENTS.md](AGENTS.md).

---

## 🏁 Get Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the application

```bash
# Start expo dev server
npx expo start
```

In the terminal output, choose from the following running targets:
* Press `a` to open in an **Android Emulator**
* Press `i` to open in the **iOS Simulator**
* Scan the QR code with your mobile camera to open in **Expo Go**
* Press `w` to open in a web browser (Vite-like compilation)
