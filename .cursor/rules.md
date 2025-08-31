## Cursor Project Rules — SofleKeyCartographer

These rules guide all agents and contributors working in Cursor for this repository. Follow them strictly. Use MD3 (Material Design 3), React Native best practices, strict TypeScript, Tailwind via NativeWind v4 (no downgrades), and D3 with react-native-svg.

### Core Principles
- Build small, focused components and classes (single responsibility, SOLID). Prefer composition.
- Strong typing everywhere; avoid any. Public APIs must be fully typed.
- Separate UI from domain logic. Use repositories for persistence; avoid generic "services".
- Keep code readable, modern, and accessible; follow MD3.

### Tech Constraints
- React Native (functional components + Hooks)
- TypeScript with strict mode
- NativeWind v4 + Tailwind (no downgrade). Use nativewind preset and darkMode: "class".
- react-native-paper v5+ (MD3)
- react-native-svg + d3-shape/d3-scale/d3-array (avoid DOM-bound d3 modules)

### Project Structure (folder-by-feature)
```
src/
  app/
    App.tsx
    providers/
  features/
    keyboard/
      components/
      models/
      repositories/
      hooks/
      utils/
      screens/
  ui/
  navigation/
  styles/
  utils/
  types/
  assets/
    svg/
    images/
    fonts/
```
- Each feature encapsulates its domain. `repositories/` exposes interfaces and concrete impls.
- `ui/` holds shared, domain-agnostic components (MD3 wrappers, inputs, buttons).
- `styles/` contains Tailwind tokens and helpers aligned to MD3.

### MD3 (react-native-paper)
- Use MD3 themes (`MD3LightTheme`/`MD3DarkTheme`) and keep tokens consistent with Tailwind.
- Prefer Paper components (Appbar, FAB, Button, SegmentedButtons, Dialog, Snackbar).
- Integrate theme with React Navigation so system bars, headers and surfaces are coherent.

### Tailwind + NativeWind
- Configure Tailwind with `presets: [require('nativewind/preset')]` and `darkMode: 'class'`.
- Use `useColorScheme()` from nativewind to toggle classes; also sync Paper theme provider.
- Define color tokens that mirror MD3 roles (primary, onPrimary, surface, onSurface, etc.).

### Theming and Dark Mode
- Single source of truth for theme: Paper provider + NativeWind className root wrapper.
- Detect system scheme but allow user override. Persist the override in a repository.

### D3 + SVG
- Render with `react-native-svg`. Use D3 for math/layout (paths, scales, aggregations).
- Avoid `d3-selection`/`d3-zoom` directly; handle gestures via RN gesture handlers and feed state to D3 calculations.
- Treat Sofle layout as data (positions, rotations). Generate keycaps from data.

### State and Data
- Prefer lightweight stores (e.g., zustand) or Context for small scopes; keep domain operations in repositories.
- Repository example: `KeyboardLayoutRepository` with `getCurrent`, `save`, `listHistory`.
- Persist JSON locally (AsyncStorage or filesystem). Optionally sync with Supabase later.

### TypeScript Standards
- `strict: true`; enable `noUnusedLocals`, `noUnusedParameters`, `noImplicitAny`.
- No unsafe casts. Define domain types for Key, Layer, KeyAction, Layout.
- Keep module boundaries typed and stable.

### Performance and Quality
- Memoize where it matters. Avoid passing unstable inline objects/funcs.
- Use FlatList/FlashList for large lists with stable keys and layout hints.
- Lint with ESLint (ts/react), format with Prettier; PRs must build cleanly.
- Tests via Jest + @testing-library/react-native for domain logic and critical UI.

### Accessibility
- Provide `accessibilityLabel`, roles, and hit slop where needed.
- Respect contrast in light/dark themes per MD3 and WCAG guidance.

### Assets and Sofle SVG
- Keep base SVG at `src/assets/svg/sofle.svg`.
- Refresh via shell when needed:
```
curl -L -o src/assets/svg/sofle.svg \
  https://git.noi.se.net/ashe/zmk-sofle/raw/commit/e8ccd222a9b0cb109e41fa08e4049a9151d1b9e6/keymap-drawer/sofle.svg
```

### Commit and Naming Conventions
- English names; PascalCase for components, camelCase for ids/vars.
- Conventional Commits.
- Prefer absolute imports from `src/` using TS path aliases.

### Non-Goals
- No downgrades of Tailwind/NativeWind/React Native to work around issues.
- No DOM-centric D3 APIs; keep RN-friendly math-only usage.


