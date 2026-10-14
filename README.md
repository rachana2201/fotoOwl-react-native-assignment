# Picsum Gallery – React Native Intern Assignment

A React Native (Expo + TypeScript) app with registration, login, persistent sessions, an image gallery
(search / filter / sort / infinite scroll / pull-to-refresh), favorites, full-screen viewer with
download-to-gallery, and an editable profile. Dark mode, avatars, share, debounced search, custom hooks and
unit tests are included as bonus features.

## Setup

Requirements: Node 20+, npm, Android Studio emulator or a phone.

```bash
npm install
npx expo start          # press "a" for Android emulator, or scan the QR in a dev build
npm test                # unit tests (31 tests)
npm run typecheck       # tsc --noEmit
```

> **Downloading to gallery** uses `expo-media-library`, which needs a real build (APK / dev build), not Expo Go.

### Build the APK

```bash
npm i -g eas-cli
eas login
eas build -p android --profile preview     # produces an installable .apk (see eas.json)
```

Local alternative (needs Android SDK): `npx expo prebuild -p android && cd android && ./gradlew assembleRelease`
→ `android/app/build/outputs/apk/release/app-release.apk`.

## Feature checklist


| Requirement                                                               | Where                                                                                                              |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Register (all fields + validation, radio gender, city dropdown)           | `screens/RegisterScreen`, `utils/validation`, `components/RadioGroup`, `components/Dropdown`                       |
| Login validated against locally stored user                               | `screens/LoginScreen`, `services/authService`                                                                      |
| Session persistence                                                       | `authStore.hydrate()` reads `@picsum/session` at launch                                                            |
| Gallery from `picsum.photos/v2/list?page=1&limit=50` using `FlatList`     | `screens/HomeScreen`, `services/imageApi`                                                                          |
| Loading / error + retry / pull-to-refresh (no duplicate calls)            | `hooks/usePaginatedImages` (in-flight ref guard)                                                                   |
| Search (case-insensitive, real-time, debounced)                           | `hooks/useImageSearch`, `hooks/useDebounce`                                                                        |
| Filter (All / Author A–M / Author N–Z) + Sort (Default / A→Z / Z→A)       | `utils/imageQuery.applyImageQuery` – one pure pipeline so search + filter + sort + pagination always agree         |
| Infinite scroll                                                           | `hooks/useGallery` (details below)                                                                                 |
| Favorites (add/remove, persisted, per-user), Favorites screen with search | `store/favoritesStore`, `screens/FavoritesScreen`                                                                  |
| Details screen + full-screen viewer + download to device gallery          | `screens/ImageDetailsScreen`, `components/FullScreenViewer`, `services/downloadService`                            |
| Profile view/edit, updates reflected immediately                          | `screens/ProfileScreen`, `authStore.updateProfile`                                                                 |
| Logout                                                                    | Profile screen (confirmation dialog)                                                                               |
| Centralised state                                                         | Zustand stores in `src/store`                                                                                      |
| Bonus                                                                     | Avatars, dark mode, debounced search, reusable components, custom hooks, unit tests, share, refresh de-duplication |

## Assumptions & design decisions

- **Auth is local-only** (no backend), as the brief asks. Passwords are stored as a salted SHA-256 hash (`expo-crypto`), never in plain text. A real app would authenticate on a server.
- **Email is the unique account key** (case-insensitive) and cannot be edited in the profile. Multiple accounts can be registered on one device.
- After registering, the user is sent to the Login screen (registration does not auto-login).
- **Infinite scroll** has two layers: (1) only 10 items are rendered at first and 10 more are added as you scroll; (2) once every loaded image is visible, the next page (`page=2`, `3`, …, 50 per page) is fetched from the API. Pagination resets to the first window when search/filter/sort changes.
- **Filter definition (documented as requested):** based on the first letter of the author's name – _A–M_ = A to M, _N–Z_ = N to Z (case-insensitive). Authors starting with a non-letter appear only under _All Images_.
- **Sort** is an extra chip that cycles Default → A→Z → Z→A and works together with search/filter.
- Thumbnails/full images use `picsum.photos/id/{id}/{w}/{h}` (resized) instead of the raw `download_url` (up to 5000 px) to save bandwidth; downloads save the full-size version capped at 1600 px wide.
- Favorites store the whole image object, so the Favorites screen works instantly and offline (thumbnails are cached by `expo-image`).
- Avatars are predefined emoji badges (no asset downloads); selection is saved on the user profile.

## Libraries used

`expo`, `react-native`, `typescript`, `@react-navigation/native` + `native-stack` + `bottom-tabs`, `zustand` (state),
`@react-native-async-storage/async-storage`, `expo-image` (caching), `expo-file-system` + `expo-media-library` (download to gallery),
`expo-crypto` (password hashing), `@expo/vector-icons`, `react-native-screens`, `react-native-safe-area-context`.
Dev: `jest`, `jest-expo`, `@testing-library/react-native`.

## Folder structure

```
App.tsx                      entry: hydrates stores, renders navigator
src/
  components/                reusable UI (Button, Input, RadioGroup, Dropdown, SearchBar, Chip, ImageCard, StateView, Avatar, FullScreenViewer)
  constants/                 cities, filter options, avatars, API + storage keys
  hooks/                     useForm, useDebounce, usePaginatedImages (API+pagination), useImageSearch, useGallery, useDownloadImage, useTheme
  navigation/                RootNavigator (auth vs app stack), MainTabs, typed params
  screens/                   Login, Register, Home, Favorites, ImageDetails, Profile
  services/                  storage (AsyncStorage wrapper), authService, imageApi, downloadService, security
  store/                     authStore, favoritesStore, themeStore (Zustand)
  theme/                     light/dark palettes
  types/                     shared TypeScript types
  utils/                     validation, imageQuery (search/filter/sort/merge) – pure & tested
  __tests__/                 validation, imageQuery, favoritesStore, auth flow
```

## AsyncStorage layout

| Key                         | Content                               |
| --------------------------- | ------------------------------------- |
| `@picsum/users`             | map of email → user (+ password hash) |
| `@picsum/session`           | email of the logged-in user           |
| `@picsum/favorites/<email>` | that user's favorite images           |
| `@picsum/theme`             | `light` / `dark`                      |

All access goes through `services/storage.ts`; stores write once per change and read once on launch.
