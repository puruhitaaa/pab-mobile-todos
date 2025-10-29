# Code Style and Conventions

## TypeScript
- Strict mode enabled in tsconfig.json
- Path mapping configured: `@/*` maps to `src/*` (though currently not used)
- Extends Expo's base TypeScript configuration

## JavaScript/TypeScript
- Single quotes for strings
- Semicolons used
- Bracket same line for objects/functions
- Trailing commas in ES5 style
- Print width: 100 characters
- Tab width: 2 spaces

## React
- Functional components with TypeScript
- Props destructuring
- React.ReactNode for children types
- Display name ESLint rule disabled

## Styling
- NativeWind (TailwindCSS for React Native)
- Styles defined as objects with className strings
- Example:
  ```tsx
  const styles = {
    container: 'flex flex-1 bg-white',
    title: 'text-xl font-bold',
  };
  ```
- Tailwind attributes configured for className

## File Structure
- Components in `/components` directory
- Assets in `/assets` directory
- Root-level config files
- Imports use relative paths (e.g., `'components/ScreenContent'`)

## Naming Conventions
- PascalCase for component names
- camelCase for variables and functions
- kebab-case for file names (TypeScript files use .tsx/.ts)

## Linting
- ESLint with Expo flat config
- Ignores `dist/*` directory
- Integrates with Prettier for code formatting