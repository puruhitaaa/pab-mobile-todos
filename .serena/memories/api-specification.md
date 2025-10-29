# API Specification

Base URL: https://pab-be-todos.vercel.app

## Endpoints

### List Todos
**GET /todos**

Retrieve a paginated, filtered, and sorted list of todos.

**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10, max: 100)
- `sort` (string, optional): Sort field - id, title, description, completed, createdAt (default: id)
- `order` (string, optional): Sort order - asc or desc (default: asc)
- `filter` (string, optional): Search filter for title and description (case-insensitive)

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Buy groceries",
      "description": "Milk, bread, eggs",
      "completed": false,
      "createdAt": "2025-10-30T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

**Axios Example:**
```typescript
import axios from 'axios';

const response = await axios.get('https://pab-be-todos.vercel.app/todos', {
  params: {
    page: 1,
    limit: 10,
    sort: 'createdAt',
    order: 'desc',
    filter: 'work'
  }
});

console.log(response.data); // { data: [...], pagination: {...} }
```

### Create Todo
**POST /todos**

Create a new todo item.

**Request Body:**
```json
{
  "title": "New Todo",
  "description": "Optional description",
  "completed": false
}
```

**Response:**
```json
{
  "id": 2,
  "title": "New Todo",
  "description": "Optional description",
  "completed": false,
  "createdAt": "2025-10-30T10:05:00.000Z"
}
```

**Axios Example:**
```typescript
const newTodo = {
  title: "Buy groceries",
  description: "Milk, bread, eggs",
  completed: false
};

const response = await axios.post('https://pab-be-todos.vercel.app/todos', newTodo);
console.log(response.data); // Created todo with ID
```

### Get Todo
**GET /todos/:id**

Retrieve a specific todo by ID.

**Response:**
```json
{
  "id": 1,
  "title": "Buy groceries",
  "description": "Milk, bread, eggs",
  "completed": false,
  "createdAt": "2025-10-30T10:00:00.000Z"
}
```

**Error Response (404):**
```json
{
  "error": "Todo not found"
}
```

**Axios Example:**
```typescript
try {
  const response = await axios.get('https://pab-be-todos.vercel.app/todos/1');
  console.log(response.data); // Single todo object
} catch (error) {
  if (error.response?.status === 404) {
    console.log('Todo not found');
  }
}
```

### Update Todo
**PUT /todos/:id**

Update an existing todo. Supports partial updates.

**Request Body:**
```json
{
  "title": "Updated title",
  "completed": true
}
```

**Response:** Same as create response.

**Axios Example:**
```typescript
const updates = {
  completed: true,
  title: "Buy groceries - Done"
};

const response = await axios.put('https://pab-be-todos.vercel.app/todos/1', updates);
console.log(response.data); // Updated todo
```

### Delete Todo
**DELETE /todos/:id**

Delete a todo by ID.

**Response:**
```json
{
  "message": "Deleted"
}
```

**Error Response (404):**
```json
{
  "error": "Todo not found"
}
```

**Axios Example:**
```typescript
try {
  const response = await axios.delete('https://pab-be-todos.vercel.app/todos/1');
  console.log(response.data); // { message: "Deleted" }
} catch (error) {
  if (error.response?.status === 404) {
    console.log('Todo not found');
  }
}
```

## Data Types

### Todo
```typescript
interface Todo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string; // ISO date string
}
```

### Pagination Info
```typescript
interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
```

### API Response
```typescript
interface ApiResponse<T> {
  data: T;
  pagination?: Pagination;
}
```

## Axios Configuration

### Global Setup
```typescript
import axios from 'axios';

// Create configured instance
const apiClient = axios.create({
  baseURL: 'https://pab-be-todos.vercel.app',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth if needed
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response?.status === 404) {
      throw new Error('Todo not found');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### Error Handling
```typescript
try {
  const response = await apiClient.get('/todos');
  // Success
} catch (error) {
  if (axios.isAxiosError(error)) {
    // Axios error
    console.log('Status:', error.response?.status);
    console.log('Data:', error.response?.data);
  } else {
    // Other error
    console.log('Error:', error.message);
  }
}
```

### Concurrent Requests
```typescript
const [todosResponse, singleTodoResponse] = await axios.all([
  axios.get('/todos'),
  axios.get('/todos/1')
]);

console.log(todosResponse.data);
console.log(singleTodoResponse.data);
```