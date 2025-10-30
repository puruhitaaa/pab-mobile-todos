import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TodoListScreen from '../screens/TodoListScreen';
import AddTodoScreen from '../screens/AddTodoScreen';
import TodoDetailScreen from '../screens/TodoDetailScreen';
import EditTodoScreen from '../screens/EditTodoScreen';

export type RootStackParamList = {
  TodoList: undefined;
  AddTodo: undefined;
  TodoDetail: { id: number };
  EditTodo: { id: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="TodoList"
      screenOptions={{
        headerStyle: { backgroundColor: '#f8f9fa' },
        headerTintColor: '#333',
        headerTitleStyle: { fontWeight: 'bold' },
      }}>
      <Stack.Screen name="TodoList" component={TodoListScreen} options={{ title: 'My Todos' }} />
      <Stack.Screen name="AddTodo" component={AddTodoScreen} options={{ title: 'Add Todo' }} />
      <Stack.Screen
        name="TodoDetail"
        component={TodoDetailScreen}
        options={{ title: 'Todo Details' }}
      />
      <Stack.Screen name="EditTodo" component={EditTodoScreen} options={{ title: 'Edit Todo' }} />
    </Stack.Navigator>
  );
}
