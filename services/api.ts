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

// Todo interface
export interface Todo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
}

// Pagination interface
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// API Response interfaces
export interface TodoListResponse {
  data: Todo[];
  pagination: PaginationInfo;
}

export interface TodoResponse {
  data: Todo;
}

export interface CreateTodoRequest {
  title: string;
  description?: string;
  completed?: boolean;
}

export interface UpdateTodoRequest {
  title?: string;
  description?: string;
  completed?: boolean;
}

export interface DeleteResponse {
  message: string;
}

// API Functions
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
