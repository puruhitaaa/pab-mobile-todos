# UI Screens and Navigation

## Navigation Setup

Based on React Navigation documentation:

```typescript
// navigation/AppNavigator.tsx
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="TodoList"
        screenOptions={{
          headerStyle: { backgroundColor: '#f8f9fa' },
          headerTintColor: '#333',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen
          name="TodoList"
          component={TodoListScreen}
          options={{ title: 'My Todos' }}
        />
        <Stack.Screen
          name="AddTodo"
          component={AddTodoScreen}
          options={{ title: 'Add Todo' }}
        />
        <Stack.Screen
          name="TodoDetail"
          component={TodoDetailScreen}
          options={{ title: 'Todo Details' }}
        />
        <Stack.Screen
          name="EditTodo"
          component={EditTodoScreen}
          options={{ title: 'Edit Todo' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

## Screen Structure

### 1. Todo List Screen (Home/Default)
**Purpose:** Main screen showing all todos with search/filter capabilities

**Components:**
- Header with app title and "Add Todo" button (+ icon)
- Search bar with debounced input
- Filter/Sort dropdown (title, date, completion status)
- Todo list using `FlatList` with:
  - TodoItem components showing title, completion status, creation date
  - Swipe actions (delete on swipe left, edit on swipe right)
  - Pull-to-refresh functionality
- Pagination controls (Load More button or infinite scroll)
- Floating Action Button for quick add
- Empty state with call-to-action when no todos

**Interactions:**
- Tap todo item → `navigation.navigate('TodoDetail', { id })`
- Tap checkbox → Toggle completion (optimistic update)
- Swipe left → Show delete confirmation
- Swipe right → `navigation.navigate('EditTodo', { id })`
- Pull down → Refresh list data
- Tap FAB → `navigation.navigate('AddTodo')`
- Search input → Filter todos in real-time

**Technical Notes:**
- Use `useFocusEffect` to refresh data when screen comes into focus
- Implement `RefreshControl` for pull-to-refresh
- Debounce search input to avoid excessive API calls

### 2. Add Todo Screen
**Purpose:** Create new todo items with form validation

**Components:**
- Form container with proper spacing
- Title input field (TextInput with validation)
- Description text area (multiline TextInput, optional)
- Save button (disabled when invalid)
- Cancel button (navigation.goBack)
- Loading overlay during submission

**Interactions:**
- Type in title → Real-time validation feedback
- Tap Save → Validate form, submit to API, navigate back on success
- Tap Cancel → Show confirmation if form has changes, then go back

**Technical Notes:**
- Form state managed with useState
- Validation: Title required, min length checks
- API call with loading state and error handling

### 3. Todo Detail Screen
**Purpose:** View complete todo information with action buttons

**Components:**
- Todo display card with:
  - Title (large text)
  - Description (if present)
  - Completion status with toggle switch
  - Creation date (formatted)
- Action buttons row:
  - Edit button → `navigation.navigate('EditTodo', { id })`
  - Delete button → Show confirmation dialog
- Back navigation in header

**Interactions:**
- Toggle completion → Immediate API update with optimistic UI
- Tap Edit → Navigate to edit screen
- Tap Delete → Show Alert dialog, delete on confirm

**Technical Notes:**
- Fetch individual todo if not in global state
- Handle loading and error states
- Use React Navigation params for todo ID

### 4. Edit Todo Screen
**Purpose:** Modify existing todos with pre-populated form

**Components:**
- Pre-populated form (same as Add screen)
- Save button (partial updates supported)
- Delete button (destructive action, styled differently)
- Loading states and validation feedback

**Interactions:**
- Modify fields → Real-time validation
- Tap Save → Update API, navigate back to detail
- Tap Delete → Show confirmation, delete and navigate to list

**Technical Notes:**
- Load existing todo data on mount
- Support partial updates (only changed fields sent to API)
- Handle concurrent edits (server wins on conflicts)

## Navigation Flow

```
Todo List → Add Todo → Todo List (with new item)
Todo List → Todo Detail → Edit Todo → Todo Detail (updated)
Todo List → Todo Detail → Delete → Todo List (item removed)
Todo List → Edit Todo (via swipe) → Todo List (updated)
```

## UI Patterns

### Todo Item Card (FlatList item)
```
┌─────────────────────────────────────────────────┐
│ ☐ Buy groceries                                │
│   📅 Oct 30, 2025                              │
│   🏷️ Milk, bread, eggs                         │
│   [Edit] [Delete]                              │
└─────────────────────────────────────────────────┘
```

### Completed Todo Item
```
┌─────────────────────────────────────────────────┐
│ ☑ Buy groceries ✓                              │
│   📅 Oct 30, 2025                              │
│   ~~Milk, bread, eggs~~                        │
└─────────────────────────────────────────────────┘
```

### Form Layout (Add/Edit)
```
┌─────────────────────────────────────────────────┐
│ Title                                          │
│ ┌─────────────────────────────────────────┐     │
│ │ Buy groceries                          │     │
│ └─────────────────────────────────────────┘     │
│                                                │
│ Description (Optional)                         │
│ ┌─────────────────────────────────────────┐     │
│ │ Milk, bread, eggs                      │     │
│ │                                         │     │
│ └─────────────────────────────────────────┘     │
│                                                │
│ [Cancel]                           [Save]      │
└─────────────────────────────────────────────────┘
```

## Responsive Design Considerations

- **Mobile First**: Design optimized for phone screens
- **Touch Targets**: Minimum 44pt (44px) touch targets
- **Text Sizes**: Readable fonts, proper contrast ratios
- **Spacing**: Consistent margins and padding using NativeWind
- **Gestures**: Swipe actions for power users, button alternatives for accessibility

## Loading and Error States

- **Skeleton Screens**: Placeholder content during loading
- **Error Boundaries**: Fallback UI for unexpected errors
- **Retry Mechanisms**: Buttons to retry failed operations
- **Offline Indicators**: Show when network unavailable

## Accessibility Features

- **Screen Reader**: Proper labels and hints for all interactive elements
- **Keyboard Navigation**: Focus management for form inputs
- **Color Contrast**: WCAG compliant color combinations
- **Semantic HTML**: Proper heading hierarchy and landmarks