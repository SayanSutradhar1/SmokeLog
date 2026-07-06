# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

---

# Agentic Memory & Codebase Guide

This document preserves the context, architectural rules, optimization decisions, and state configurations of the **SmokeLog** project for future AI development.

## 1. Project Overview
SmokeLog is a mobile-first mindful nicotine reduction application built using Expo, React Native, and TypeScript. Its goal is to help users break subconscious habit loops by creating behavioral friction (logging), expanding the gap between smokes, and tracking mathematical trajectory control over time.

---

## 2. Core Codebase Directory Structure
```
src/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx       # Bottom tabs navigation configuration
│   │   ├── dashboard.tsx     # Behavioral overview, stats breakdown & glossary
│   │   ├── index.tsx         # Gap Tracker (active counter, logging, breathing)
│   │   ├── history.tsx       # List of logs & trigger breakdowns
│   │   ├── savings.tsx       # Financial savings & health recovery metrics
│   │   └── settings.tsx      # User baseline & Reduction speed setup
│   └── _layout.tsx           # App entry, Context Provider wrapping & Onboarding gate
├── components/
│   ├── dashboard/            # Subcomponents for Dashboard screen
│   ├── tracker/              # Subcomponents for Gap Tracker screen
│   ├── history/              # Subcomponents for Logs History screen
│   ├── savings/              # Subcomponents for Stats & Health screen
│   ├── settings/             # Subcomponents for Settings configuration
│   └── Onboarding.tsx        # App initialization setup slide deck
├── context/
│   └── SmokeContext.tsx      # Global React Context providing state & actions
├── hooks/
│   └── useSmoke.ts           # Extracted Custom hook to consume SmokeContext
└── utils/
    ├── gapAnalysis.ts        # Trajectory, Score, and Gap Analyzer class
    └── storage.ts            # Local SQLite/AsyncStorage persistent StorageManager class
```

---

## 3. Strict Rules & Architectural Guidelines

### A. Path Aliasing
* Always use the `@/` alias for importing files under the `src` directory as defined in `tsconfig.json` (e.g. `import { useSmoke } from "@/hooks/useSmoke"`).
* Avoid relative imports (`../../`) for files located inside `src/`.

### B. UI Component Separation
* **Never** inline large UI blocks directly in tab screen entrypoints (`src/app/(tabs)/*`).
* Keep screens clean as state and driver containers. Extract visual layout and markup into separate files inside `src/components/<screen_name>/` and import them.

### C. Safe Area Compliance
* Do not use standard `SafeAreaView` from `react-native`. Always import `SafeAreaView` from `react-native-safe-area-context` to maintain consistency across iOS and Android safe zones.
* The bottom navigation tab bar height and padding must be dynamically calculated inside `src/app/(tabs)/_layout.tsx` using `useSafeAreaInsets()` to prevent overlapping with system gesture home indicators:
  * `height: 54 + Math.max(insets.bottom, 8)`
  * `paddingBottom: Math.max(insets.bottom, 6)`

### D. Memory Leak Prevention
* **Interval Timers**: Never store `setInterval` IDs in React `useState`. Component state updates are asynchronous and prone to leaving background intervals running during rapid cancels or component unmounts. Always store timers inside a React `useRef` (e.g. `breathingTimerRef` in `index.tsx`) and clear them synchronously:
  ```typescript
  if (timerRef.current) {
    clearInterval(timerRef.current);
    timerRef.current = null;
  }
  ```
* **Render-Time Array Computations**: To prevent high heap memory allocation and garbage collection churn, do not perform raw array mutations, sorting, or new calculations inside contexts or components.
  * Use the class-based memoized `GapAnalyzer` and wrap all context-level derivations in React `useMemo` hooks inside `src/context/SmokeContext.tsx`.

### E. Responsiveness & Wide Screen Adaptations
* **Dynamic Grid Layouts**: On tablets and wider viewports (`useResponsive().isMobile === false`), screen content should avoid stretching full-width.
  * For form/config screens (e.g. `index.tsx`, `settings.tsx`, `Onboarding.tsx`, `history.tsx`), apply a centered alignment container with `alignSelf: "center"` and a fixed width limit (typically `500px` or `600px`).
  * For overview/stats panels (e.g. `dashboard.tsx`, `savings.tsx`), utilize a row-based grid system to show primary cards and detailed listings side-by-side (left column vs right column).
* **Circular Sizing**: Circular dials or radial shapes (e.g. `CounterSection.tsx`) must fetch layout metrics from the `useResponsive` hook instead of static `Dimensions.get("window")` declarations to handle orientation changes or multitasking splits gracefully.

---

## 4. Class-Based Utilities & Memoization
* **`GapAnalyzer`** ([src/utils/gapAnalysis.ts](file:///C:/Users/HP/Desktop/works/smokelog/src/utils/gapAnalysis.ts)): Encapsulates logs array operations. It caches chronological sort arrays and calculated gap structures inside the class instance, eliminating repeated sorting during sub-array calculations.
* **`StorageManager`** ([src/utils/storage.ts](file:///C:/Users/HP/Desktop/works/smokelog/src/utils/storage.ts)): Aggregates AsyncStorage operations under `static` methods.

---

## 5. Main State Context Contract (`SmokeContextType`)
The global state exposed via `useSmoke()` exposes the following:
* `settings`: Configured user parameters (`UserSettings`).
* `logs`: Array of logged cigarettes (`SmokeLog[]`).
* `cravings`: Array of mindfulness deflection sessions (`CravingSession[]`).
* `secondsSinceLastSmoke`: Seconds elapsed since the newest logged timestamp.
* `targetGapSeconds`: Dynamic baseline gap adjusted by day and reduction pace rate.
* `progressToTarget`: Percentage progress to meeting the next target gap.
* `lowestGap`, `highestGap`, `avgGap`: Analyzed gap limits.
* `evaluatedLogs`: Logs list evaluated against prior historical averages.
* `trajectory`: Momentum analysis (`status`, `score` out of 100, `recentAvgGap`, etc.).
* `moneySaved`, `cigarettesSaved`, `healthProgress`: Tangible financial and physiological markers.
