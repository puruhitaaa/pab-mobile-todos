# 📱 PAB Mobile Todos

A modern, feature-rich React Native todo application built with Expo, featuring a beautiful UI powered by NativeWind (Tailwind CSS), robust state management, and seamless API integration.

![React Native](https://img.shields.io/badge/React%20Native-0.81.5-blue.svg)
![Expo](https://img.shields.io/badge/Expo-54.0.0-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue.svg)
![NativeWind](https://img.shields.io/badge/NativeWind-Latest-purple.svg)

## ✨ Features

- **📝 Complete CRUD Operations** - Create, read, update, and delete todos
- **🔍 Real-time Search** - Debounced search with 300ms delay for optimal performance
- **📱 Modern UI** - Beautiful, responsive design using NativeWind (Tailwind CSS)
- **🔄 Pull-to-Refresh** - Refresh todos with smooth pull-down gesture
- **📊 Pagination Support** - Efficient loading with pagination
- **💾 Offline Persistence** - AsyncStorage integration for local data storage
- **🚀 Fast Navigation** - React Navigation v7 with native stack navigation
- **🎨 Custom Components** - Reusable Container component for consistent layout
- **⚡ Optimized Performance** - Debounced search, efficient re-renders, and lazy loading
- **🛡️ Type Safety** - Full TypeScript support with strict type checking
- **🎯 Error Handling** - Comprehensive error handling with user-friendly messages
- **📱 Cross-Platform** - Works on iOS, Android, and Web

## 🛠️ Tech Stack

### Core Framework

- **React Native 0.81.5** - Latest React Native with improved performance
- **Expo SDK 54** - Managed workflow with latest features
- **React 19.1.0** - Latest React with concurrent features

### UI & Styling

- **NativeWind** - Tailwind CSS for React Native
- **React Native Safe Area Context** - Safe area handling
- **React Native Screens** - Native navigation screens

### Navigation & State

- **React Navigation v7** - Latest navigation with improved performance
- **React Context + useReducer** - Robust state management
- **AsyncStorage** - Local data persistence

### HTTP & API

- **Axios** - HTTP client with interceptors
- **RESTful API** - Clean API integration with error handling

### Development Tools

- **TypeScript 5.9.2** - Type safety and better DX
- **ESLint** - Code linting with Expo config
- **Prettier** - Code formatting with Tailwind plugin
- **Custom Hooks** - useDebounce for search optimization

### Build & Package Management

- **pnpm** - Fast, disk-efficient package manager
- **Metro Bundler** - Optimized bundling for React Native

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **pnpm** (v8 or higher) - [Installation guide](https://pnpm.io/installation)
- **Expo CLI** - Install globally: `npm install -g @expo/cli`
- **Android Studio** (for Android development) - [Download here](https://developer.android.com/studio)
- **Xcode** (for iOS development on macOS) - [Download from App Store](https://apps.apple.com/app/xcode/id497799835)

## 🚀 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/pab-mobile-todos.git
   cd pab-mobile-todos
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Start the development server**

   ```bash
   pnpm start
   ```

4. **Run on your device/emulator**
   - **Android**: `pnpm android` or press `a` in Expo CLI
   - **iOS**: `pnpm ios` or press `i` in Expo CLI (macOS only)
   - **Web**: `pnpm web` or press `w` in Expo CLI

## 📱 Usage

### Basic Operations

1. **View Todos**: Launch the app to see your todo list
2. **Add Todo**: Tap the "+" button to create a new todo
3. **Search Todos**: Type in the search bar to filter todos (debounced search)
4. **View Details**: Tap any todo to see full details
5. **Edit Todo**: Tap "Edit" in todo details to modify
6. **Toggle Complete**: Tap the checkbox to mark todos as complete/incomplete
7. **Delete Todo**: Tap "Delete" to remove todos with confirmation
8. **Refresh**: Pull down to refresh the todo list

### Search Functionality

- **Debounced Search**: Search input waits 300ms after you stop typing before filtering
- **Real-time Results**: See filtered results appear automatically
- **Clear Search**: Clear the search input to view all todos
- **Case-insensitive**: Search works regardless of letter case

## 🏗️ Project Structure

```
pab-mobile-todos/
├── 📁 assets/                 # Static assets (icons, images)
├── 📁 components/             # Reusable UI components
│   ├── Container.tsx         # Layout wrapper with safe area
│   ├── EditScreenInfo.tsx    # Development info component
│   └── ScreenContent.tsx     # Screen content wrapper
├── 📁 context/               # React Context for state management
│   └── TodoContext.tsx       # Todo state, actions, and API calls
├── 📁 navigation/            # Navigation configuration
│   └── AppNavigator.tsx      # Stack navigator setup
├── 📁 screens/               # Main application screens
│   ├── TodoListScreen.tsx    # Main todo list with search
│   ├── AddTodoScreen.tsx     # Add new todo form
│   ├── TodoDetailScreen.tsx  # Todo details and actions
│   └── EditTodoScreen.tsx    # Edit existing todo form
├── 📁 services/              # API and external services
│   └── api.ts                # Axios configuration and API functions
├── 📁 utils/                 # Utility functions and hooks
│   └── useDebounce.ts        # Custom debounce hook
├── App.tsx                   # Main app component with providers
├── app.json                  # Expo configuration
├── babel.config.js           # Babel configuration
├── global.css                # Global styles for NativeWind
├── metro.config.js           # Metro bundler configuration
├── package.json              # Dependencies and scripts
├── tailwind.config.js        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── README.md                 # This file
```

## 🔗 API Integration

The app integrates with a RESTful API hosted at `https://pab-be-todos.vercel.app`.

### Available Endpoints

- `GET /todos` - List todos with pagination and filtering
- `POST /todos` - Create a new todo
- `GET /todos/:id` - Get a specific todo
- `PUT /todos/:id` - Update a todo
- `DELETE /todos/:id` - Delete a todo

### Query Parameters

- `page` - Page number for pagination
- `limit` - Number of items per page
- `filter` - Search filter for title/description
- `sort` - Sort field (createdAt, title, etc.)
- `order` - Sort order (asc/desc)

### Error Handling

The app includes comprehensive error handling:

- Network errors with retry options
- Server errors with user-friendly messages
- 404 errors for missing todos
- Timeout handling for slow requests

## 📜 Scripts

```bash
# Development
pnpm start          # Start Expo development server
pnpm android        # Run on Android emulator/device
pnpm ios           # Run on iOS simulator (macOS only)
pnpm web           # Run in web browser

# Building
pnpm prebuild      # Generate native code for custom builds

# Code Quality
pnpm lint          # Run ESLint and Prettier checks
pnpm format        # Auto-fix ESLint issues and format code
```

## 🎨 Styling

The app uses **NativeWind** (Tailwind CSS for React Native) for styling:

### Key Design Principles

- **Consistent Spacing**: Uses Tailwind's spacing scale
- **Modern Colors**: Blue primary color with gray neutrals
- **Rounded Corners**: Generous border radius for modern look
- **Shadows**: Subtle shadows for depth and hierarchy
- **Typography**: Clear hierarchy with appropriate font weights
- **Responsive**: Adapts to different screen sizes

### Color Palette

- **Primary**: Blue (#3B82F6)
- **Success**: Green (#10B981)
- **Error**: Red (#EF4444)
- **Warning**: Yellow/Orange tones
- **Neutral**: Gray scale (#6B7280, #9CA3AF, etc.)

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
API_BASE_URL=https://pab-be-todos.vercel.app
# Add other environment variables as needed
```

### TypeScript Configuration

The app uses strict TypeScript configuration with:

- Strict type checking enabled
- Path mapping for clean imports
- Expo-specific type definitions

### ESLint Configuration

- **Expo Config**: Uses `eslint-config-expo` for React Native best practices
- **Prettier Integration**: Integrated with Prettier for consistent formatting
- **TypeScript Support**: Full TypeScript linting rules

## 🧪 Testing

### Manual Testing Checklist

- [ ] App launches without errors
- [ ] Todo list loads on app start
- [ ] Add todo functionality works
- [ ] Search filters todos correctly
- [ ] Clear search shows all todos
- [ ] Todo details display correctly
- [ ] Edit todo functionality works
- [ ] Delete todo with confirmation works
- [ ] Toggle complete status works
- [ ] Pull-to-refresh works
- [ ] Error states display properly
- [ ] Loading states show during API calls

### Performance Testing

- [ ] Search debouncing prevents excessive API calls
- [ ] List scrolling is smooth
- [ ] Memory usage is reasonable
- [ ] App responds quickly to user interactions

## 🚀 Deployment

### Building for Production

1. **Configure app.json** with your app details
2. **Build for Android**:
   ```bash
   expo build:android
   ```
3. **Build for iOS**:
   ```bash
   expo build:ios
   ```

### Publishing to Expo

```bash
expo publish
```

### App Store Deployment

1. **Android**: Generate APK/AAB and upload to Google Play Console
2. **iOS**: Generate IPA and upload to App Store Connect

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and conventions
- Write clear, concise commit messages
- Test your changes thoroughly
- Update documentation as needed
- Ensure TypeScript types are correct
- Run linting and formatting before committing

## 🙏 Acknowledgments

- **Expo Team** for the amazing React Native development platform
- **React Navigation** for seamless navigation experience
- **NativeWind** for bringing Tailwind CSS to React Native
- **Axios** for reliable HTTP client functionality
