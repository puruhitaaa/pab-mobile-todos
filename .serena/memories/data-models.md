# Data Models and State Management

## TypeScript Interfaces

### Core Todo Interface
```typescript
interface Todo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string; // ISO 8601 date string
}
```

### API Response Types
```typescript
interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface TodoListResponse {
  data: Todo[];
  pagination: PaginationInfo;
}

interface TodoResponse {
  data: Todo;
}

interface CreateTodoRequest {
  title: string;
  description?: string;
  completed?: boolean;
}

interface UpdateTodoRequest {
  title?: string;
  description?: string;
  completed?: boolean;
}

interface ApiError {
  error: string;
}

interface DeleteResponse {
  message: string;
}
```

### UI State Types
```typescript
interface TodoFilters {
  search: string;
  sortBy: 'id' | 'title' | 'description' | 'completed' | 'createdAt';
  sortOrder: 'asc' | 'desc';
  page: number;
  limit: number;
}

interface UiState {
  loading: boolean;
  error: string | null;
  refreshing: boolean;
}
```

## API Service Layer with Axios

### API Client Configuration
Based on Axios documentation:

```typescript
import axios, { AxiosInstance, AxiosResponse } from 'axios';

const API_BASE_URL = 'https://pab-be-todos.vercel.app';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for common headers
apiClient.interceptors.request.use(
  (config) => {
    // Add auth headers if needed in future
    // config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    // Handle common errors
    if (error.response?.status === 404) {
      throw new Error('Todo not found');
    }
    if (error.response?.status >= 500) {
      throw new Error('Server error. Please try again later.');
    }
    if (error.code === 'NETWORK_ERROR') {
      throw new Error('Network error. Check your connection.');
    }
    throw error;
  }
);
```

### API Functions
```typescript
export const todoApi = {
  // GET /todos - List todos with pagination/filtering
  getTodos: async (params?: {
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'asc' | 'desc';
    filter?: string;
  }): Promise<TodoListResponse> => {
    const response = await apiClient.get('/todos', { params });
    return response.data;
  },

  // POST /todos - Create todo
  createTodo: async (data: CreateTodoRequest): Promise<Todo> => {
    const response = await apiClient.post('/todos', data);
    return response.data;
  },

  // GET /todos/:id - Get single todo
  getTodo: async (id: number): Promise<Todo> => {
    const response = await apiClient.get(`/todos/${id}`);
    return response.data;
  },

  // PUT /todos/:id - Update todo
  updateTodo: async (id: number, data: UpdateTodoRequest): Promise<Todo> => {
    const response = await apiClient.put(`/todos/${id}`, data);
    return response.data;
  },

  // DELETE /todos/:id - Delete todo
  deleteTodo: async (id: number): Promise<void> => {
    await apiClient.delete(`/todos/${id}`);
  },
};
```

## Local Storage with AsyncStorage

### AsyncStorage Usage Examples
Based on AsyncStorage documentation:

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Store data
const storeData = async (key: string, value: any) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.error('Failed to save data', e);
  }
};

// Retrieve data
const getData = async (key: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Failed to load data', e);
  }
};

// Remove data
const removeData = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.error('Failed to remove data', e);
  }
};

// Batch operations
const storeMultipleData = async (data: [string, any][]) => {
  try {
    const dataToStore = data.map(([key, value]) => [key, JSON.stringify(value)]);
    await AsyncStorage.multiSet(dataToStore);
  } catch (e) {
    console.error('Failed to store multiple data', e);
  }
};
```

### useAsyncStorage Hook
For React components:

```typescript
import { useAsyncStorage } from '@react-native-async-storage/async-storage';

function UserPreferences() {
  const [preferences, setPreferences] = useState(null);
  const { getItem, setItem } = useAsyncStorage('@user_preferences');

  useEffect(() => {
    const loadPreferences = async () => {
      const value = await getItem();
      if (value) {
        setPreferences(JSON.parse(value));
      }
    };
    loadPreferences();
  }, []);

  const updatePreferences = async (newPrefs) => {
    const updated = { ...preferences, ...newPrefs };
    await setItem(JSON.stringify(updated));
    setPreferences(updated);
  };

  return { preferences, updatePreferences };
}
```

## State Management Structure

### Global App State (Context)
```typescript
interface TodoContextType {
  // Data
  todos: Todo[];
  pagination: PaginationInfo | null;

  // UI State
  loading: boolean;
  error: string | null;
  refreshing: boolean;

  // Filters
  filters: TodoFilters;

  // Actions
  fetchTodos: (filters?: Partial<TodoFilters>) => Promise<void>;
  createTodo: (todo: CreateTodoRequest) => Promise<void>;
  updateTodo: (id: number, updates: UpdateTodoRequest) => Promise<void>;
  deleteTodo: (id: number) => Promise<void>;
  toggleTodo: (id: number) => Promise<void>;
  setFilters: (filters: Partial<TodoFilters>) => void;
  refreshTodos: () => Promise<void>;
  clearError: () => void;
}
```

## Data Flow

1. **User Action** → Dispatch action to update local state (optimistic updates)
2. **API Call** → Use Axios to make HTTP request
3. **Response Handling** → Update context state or revert on error
4. **Local Storage** → Cache data using AsyncStorage for offline access
5. **UI Update** → React components re-render based on state changes

## Error Handling Strategy

- **Network Errors**: Show user-friendly messages, retry options
- **Validation Errors**: Field-specific error display
- **Server Errors**: Generic messages with logging
- **AsyncStorage Errors**: Graceful fallbacks, non-blocking

## Performance Considerations

- **Axios**: Configured with reasonable timeouts and interceptors
- **AsyncStorage**: Use for caching, not primary data source
- **State Updates**: Minimize re-renders with proper memoization
- **API Calls**: Debounce search requests, implement request cancellation