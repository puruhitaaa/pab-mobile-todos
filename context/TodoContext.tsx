import React, { createContext, useContext, useReducer, ReactNode, useCallback } from 'react';
import {
  Todo,
  PaginationInfo,
  CreateTodoRequest,
  UpdateTodoRequest,
  todoApi,
} from '../services/api';

interface TodoState {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  refreshing: boolean;
  pagination: PaginationInfo | null;
  filters: {
    filter: string;
    sortBy: 'id' | 'title' | 'description' | 'completed' | 'createdAt';
    sortOrder: 'asc' | 'desc';
    page: number;
    limit: number;
  };
}

type TodoAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_TODOS'; payload: { todos: Todo[]; pagination: PaginationInfo } }
  | { type: 'ADD_TODO'; payload: Todo }
  | { type: 'UPDATE_TODO'; payload: Todo }
  | { type: 'DELETE_TODO'; payload: number }
  | { type: 'SET_FILTERS'; payload: Partial<TodoState['filters']> }
  | { type: 'SET_REFRESHING'; payload: boolean };

const initialState: TodoState = {
  todos: [],
  loading: false,
  error: null,
  refreshing: false,
  pagination: null,
  filters: {
    filter: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 10,
  },
};

function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_TODOS':
      return {
        ...state,
        todos: action.payload.todos,
        pagination: action.payload.pagination,
        loading: false,
        error: null,
      };
    case 'ADD_TODO':
      return {
        ...state,
        todos: [action.payload, ...state.todos],
        loading: false,
      };
    case 'UPDATE_TODO':
      return {
        ...state,
        todos: state.todos.map((todo) => (todo.id === action.payload.id ? action.payload : todo)),
        loading: false,
      };
    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload),
        loading: false,
      };
    case 'SET_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };
    case 'SET_REFRESHING':
      return { ...state, refreshing: action.payload };
    default:
      return state;
  }
}

interface TodoContextType {
  state: TodoState;
  dispatch: React.Dispatch<TodoAction>;
  // Actions
  fetchTodos: (filters?: Partial<TodoState['filters']>) => Promise<void>;
  getTodo: (id: number) => Promise<Todo>;
  createTodo: (todo: CreateTodoRequest) => Promise<void>;
  updateTodo: (id: number, updates: UpdateTodoRequest) => Promise<void>;
  deleteTodo: (id: number) => Promise<void>;
  toggleTodo: (id: number) => Promise<void>;
  setFilters: (filters: Partial<TodoState['filters']>) => void;
  refreshTodos: () => Promise<void>;
  clearError: () => void;
}

const TodoContext = createContext<TodoContextType | null>(null);

export const useTodo = () => {
  const context = useContext(TodoContext);
  if (!context) throw new Error('useTodo must be used within TodoProvider');
  return context;
};

interface TodoProviderProps {
  children: ReactNode;
}

export const TodoProvider: React.FC<TodoProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(todoReducer, initialState);

  const fetchTodos = useCallback(
    async (filters?: Partial<TodoState['filters']>) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });

        const params = { ...state.filters, ...filters };
        const response = await todoApi.getTodos(params);

        dispatch({
          type: 'SET_TODOS',
          payload: { todos: response.data, pagination: response.pagination },
        });
        dispatch({ type: 'SET_FILTERS', payload: params });
      } catch (error) {
        dispatch({
          type: 'SET_ERROR',
          payload: error instanceof Error ? error.message : 'Failed to fetch todos',
        });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
        dispatch({ type: 'SET_REFRESHING', payload: false });
      }
    },
    [state.filters]
  );

  const getTodo = useCallback(async (id: number): Promise<Todo> => {
    try {
      const todo = await todoApi.getTodo(id);
      return todo;
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to fetch todo',
      });
      throw error;
    }
  }, []);

  const createTodo = useCallback(async (todo: CreateTodoRequest) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const newTodo = await todoApi.createTodo(todo);
      dispatch({ type: 'ADD_TODO', payload: newTodo });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to create todo',
      });
      throw error; // Re-throw to handle in component
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const updateTodo = useCallback(async (id: number, updates: UpdateTodoRequest) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const updatedTodo = await todoApi.updateTodo(id, updates);
      dispatch({ type: 'UPDATE_TODO', payload: updatedTodo });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to update todo',
      });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const deleteTodo = useCallback(async (id: number) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await todoApi.deleteTodo(id);
      dispatch({ type: 'DELETE_TODO', payload: id });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to delete todo',
      });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const toggleTodo = useCallback(
    async (id: number) => {
      const todo = state.todos.find((t) => t.id === id);
      if (!todo) return;

      // Optimistic update
      const updatedTodo = { ...todo, completed: !todo.completed };
      dispatch({ type: 'UPDATE_TODO', payload: updatedTodo });

      try {
        await todoApi.updateTodo(id, { completed: updatedTodo.completed });
      } catch (error) {
        // Revert on error
        dispatch({ type: 'UPDATE_TODO', payload: todo });
        dispatch({
          type: 'SET_ERROR',
          payload: error instanceof Error ? error.message : 'Failed to toggle todo',
        });
      }
    },
    [state.todos]
  );

  const setFilters = useCallback((filters: Partial<TodoState['filters']>) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  }, []);

  const refreshTodos = useCallback(async () => {
    dispatch({ type: 'SET_REFRESHING', payload: true });
    await fetchTodos();
  }, [fetchTodos]);

  const clearError = useCallback(() => {
    dispatch({ type: 'SET_ERROR', payload: null });
  }, []);

  const value: TodoContextType = {
    state,
    dispatch,
    fetchTodos,
    getTodo,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    setFilters,
    refreshTodos,
    clearError,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};
