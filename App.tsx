import { StatusBar } from 'expo-status-bar';
import AppNavigator from './navigation/AppNavigator';
import { TodoProvider } from './context/TodoContext';

import './global.css';

export default function App() {
  return (
    <TodoProvider>
      <AppNavigator />
      <StatusBar style="auto" />
    </TodoProvider>
  );
}
