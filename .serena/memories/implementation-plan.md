# Implementation Plan

## Phase 1: Project Setup and Core Infrastructure

### 1.1 Install Required Dependencies
Based on up-to-date documentation from Context7:

```bash
# React Navigation (latest stable versions)
npx expo install @react-navigation/native
npx expo install @react-navigation/native-stack
npx expo install react-native-screens react-native-safe-area-context

# HTTP Client
npm install axios

# Local Storage (for future offline features)
npx expo install @react-native-async-storage/async-storage
```

**Key Notes:**
- Use `npx expo install` for Expo-managed dependencies to ensure compatibility
- React Navigation requires `react-native-screens` and `react-native-safe-area-context` for native stack navigation
- Axios is the recommended HTTP client for React Native with full Promise support

### 1.2 Set Up Navigation
Following React Navigation v6+ patterns:

```typescript
// In App.tsx or navigation/AppNavigator.tsx
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="TodoList">
        <Stack.Screen name="TodoList" component={TodoListScreen} />
        <Stack.Screen name="AddTodo" component={AddTodoScreen} />
        <Stack.Screen name="TodoDetail" component={TodoDetailScreen} />
        <Stack.Screen name="EditTodo" component={EditTodoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

### 1.3 Create API Service Layer
Using Axios for HTTP requests:

```typescript
// services/api.ts
import axios from 'axios';

const API_BASE_URL = 'https://pab-be-todos.vercel.app';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor for common headers
apiClient.interceptors.request.use(
  (config) => {
    // Add auth headers if needed in future
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors (401, 500, etc.)
    return Promise.reject(error);
  }
);

export const todoApi = {
  // GET /todos - List todos with pagination/filtering
  getTodos: (params?: {
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'asc' | 'desc';
    filter?: string;
  }) => apiClient.get('/todos', { params }),

  // POST /todos - Create todo
  createTodo: (data: { title: string; description?: string; completed?: boolean }) =>
    apiClient.post('/todos', data),

  // GET /todos/:id - Get single todo
  getTodo: (id: number) => apiClient.get(`/todos/${id}`),

  // PUT /todos/:id - Update todo
  updateTodo: (id: number, data: Partial<{ title: string; description?: string; completed: boolean }>) =>
    apiClient.put(`/todos/${id}`, data),

  // DELETE /todos/:id - Delete todo
  deleteTodo: (id: number) => apiClient.delete(`/todos/${id}`),
};
```

### 1.4 Set Up State Management
React Context with hooks:

```typescript
// context/TodoContext.tsx
import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface Todo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
}

interface TodoState {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
}

type TodoAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_TODOS'; payload: { todos: Todo[]; pagination: any } }
  | { type: 'ADD_TODO'; payload: Todo }
  | { type: 'UPDATE_TODO'; payload: Todo }
  | { type: 'DELETE_TODO'; payload: number };

const TodoContext = createContext<{
  state: TodoState;
  dispatch: React.Dispatch<TodoAction>;
} | null>(null);

export const useTodo = () => {
  const context = useContext(TodoContext);
  if (!context) throw new Error('useTodo must be used within TodoProvider');
  return context;
};
```

## Phase 2: Core Screens Implementation

### 2.1 Todo List Screen
- Use `useFocusEffect` from React Navigation for data fetching on screen focus
- Implement pull-to-refresh with `RefreshControl`
- Handle pagination with infinite scroll or "Load More" button

### 2.2 Add Todo Screen
- Form validation with real-time feedback
- Use `navigation.goBack()` to return to list after creation

### 2.3 Todo Detail Screen
- Fetch individual todo if not in state
- Quick actions for edit/delete

### 2.4 Edit Todo Screen
- Pre-populate form with existing data
- Partial updates supported by API

## Phase 3: UI Polish and UX Improvements

### 3.1 Styling and Theming
- Consistent NativeWind classes
- Custom components for buttons, inputs, cards
- Loading spinners and skeleton screens

### 3.2 Error Handling and Feedback
- Toast notifications using `react-native-toast-message`
- Retry mechanisms for failed requests
- Offline indicators

### 3.3 Performance Optimizations
- `React.memo` for list items
- Debounced search input
- Optimistic updates for better UX

## Phase 4: Testing and Refinement

### 4.1 Testing
- Unit tests for API functions using Jest
- Component tests with React Native Testing Library
- Mock AsyncStorage for tests

### 4.2 Code Quality
- ESLint with React Navigation specific rules
- Prettier formatting
- TypeScript strict checks

### 4.3 Deployment Preparation
- Build optimization
- Error tracking setup
- Performance monitoring

## Development Workflow

1. **Set up navigation and basic screens** - Get routing working
2. **Implement API integration** - Connect to backend
3. **Build CRUD operations** - Complete data flow
4. **Add search/filter/sort** - Enhanced functionality
5. **Polish UI/UX** - Animations, loading states, error handling
6. **Testing and optimization** - Ensure stability

## File Structure Plan

```
components/
├── TodoList.tsx          # Main list with FlatList
├── TodoItem.tsx          # Individual todo card with actions
├── TodoForm.tsx          # Reusable form for add/edit
├── SearchBar.tsx         # Search input with debouncing
├── LoadingSpinner.tsx    # ActivityIndicator wrapper
├── ErrorMessage.tsx      # Error display with retry
└── EmptyState.tsx        # Empty list placeholder

screens/
├── TodoListScreen.tsx    # Home screen with list
├── AddTodoScreen.tsx     # Add new todo
├── TodoDetailScreen.tsx  # View todo details
└── EditTodoScreen.tsx    # Edit existing todo

services/
├── api.ts                # Axios client and API functions
└── types.ts              # TypeScript interfaces

context/
└── TodoContext.tsx       # Global state management

navigation/
└── AppNavigator.tsx      # Navigation setup

utils/
└── constants.ts          # API URLs, colors, etc.
```

## Success Criteria

- ✅ All CRUD operations working with proper error handling
- ✅ Smooth navigation with React Navigation
- ✅ Responsive UI with NativeWind styling
- ✅ Search, filter, and sort functionality
- ✅ Pull-to-refresh and loading states
- ✅ Form validation and user feedback
- ✅ TypeScript coverage for all components
- ✅ Clean, maintainable code structure