# Project Structure

```
pab-mobile-todos/
├── App.tsx                 # Main app component
├── global.css              # Global styles (TailwindCSS directives)
├── package.json            # Dependencies and scripts
├── pnpm-lock.yaml          # Lockfile for pnpm
├── app.json                # Expo configuration
├── tsconfig.json           # TypeScript configuration
├── eslint.config.js        # ESLint configuration
├── prettier.config.js      # Prettier configuration
├── tailwind.config.js      # TailwindCSS configuration
├── babel.config.js         # Babel configuration
├── metro.config.js         # Metro bundler configuration
├── nativewind-env.d.ts     # NativeWind type definitions
├── cesconfig.jsonc         # Create Expo App configuration
├── components/             # Reusable React components
│   ├── Container.tsx       # Safe area wrapper component
│   ├── EditScreenInfo.tsx  # Development info component
│   └── ScreenContent.tsx   # Main screen layout component
└── assets/                 # Static assets
    ├── adaptive-icon.png   # Android adaptive icon
    ├── favicon.png         # Web favicon
    ├── icon.png            # App icon
    └── splash.png          # Splash screen image
```

## Key Files Description

- **App.tsx**: Entry point, renders the main screen
- **components/ScreenContent.tsx**: Layout component with title and content area
- **components/EditScreenInfo.tsx**: Shows development instructions
- **components/Container.tsx**: Provides safe area and basic flex layout
- **global.css**: Imports TailwindCSS base styles
- **assets/**: Contains all visual assets for the app