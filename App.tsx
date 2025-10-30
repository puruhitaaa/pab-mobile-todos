import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import { TodoProvider } from './context/TodoContext';

import './global.css';

export default function App() {
  return (
    <NavigationContainer>
      <TodoProvider>
        <AppNavigator />
        <StatusBar style="auto" />
      </TodoProvider>
    </NavigationContainer>
  );
}
