import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTodo } from '../context/TodoContext';
import { Todo } from '../services/api';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Container } from '../components/Container';

type TodoListScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TodoList'>;

export default function TodoListScreen() {
  const navigation = useNavigation<TodoListScreenNavigationProp>();
  const { state, fetchTodos, toggleTodo, deleteTodo, refreshTodos } = useTodo();
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch todos when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchTodos();
    }, [fetchTodos])
  );

  const handleToggleTodo = async (id: number) => {
    try {
      await toggleTodo(id);
    } catch (error) {
      // Error already handled in context
      console.log('Toggle error:', error);
    }
  };

  const handleDeleteTodo = (id: number) => {
    Alert.alert('Delete Todo', 'Are you sure you want to delete this todo?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteTodo(id);
          } catch (error) {
            // Error already handled in context
            console.log('Delete error:', error);
          }
        },
      },
    ]);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Debounce search - in a real app you'd use a library like lodash.debounce
    setTimeout(() => {
      fetchTodos({ search: query });
    }, 300);
  };

  const renderTodoItem = ({ item }: { item: Todo }) => (
    <TouchableOpacity
      className="mx-4 mb-2 rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
      onPress={() => navigation.navigate('TodoDetail', { id: item.id })}>
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text
            className={`text-lg font-medium ${
              item.completed ? 'text-gray-500 line-through' : 'text-gray-900'
            }`}>
            {item.title}
          </Text>
          {item.description && (
            <Text
              className={`mt-1 text-sm ${
                item.completed ? 'text-gray-400 line-through' : 'text-gray-600'
              }`}>
              {item.description}
            </Text>
          )}
          <Text className="mt-2 text-xs text-gray-400">
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
        <View className="flex-row items-center">
          <TouchableOpacity
            className={`mr-3 h-6 w-6 rounded-full border-2 ${
              item.completed ? 'border-green-500 bg-green-500' : 'border-gray-300'
            }`}
            onPress={() => handleToggleTodo(item.id)}>
            {item.completed && <Text className="text-center text-white">✓</Text>}
          </TouchableOpacity>
          <TouchableOpacity
            className="rounded bg-red-500 px-3 py-1"
            onPress={() => handleDeleteTodo(item.id)}>
            <Text className="text-sm text-white">Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View className="flex-1 items-center justify-center py-12">
      <Text className="mb-2 text-lg text-gray-500">No todos yet</Text>
      <Text className="px-8 text-center text-gray-400">
        Tap the + button to add your first todo
      </Text>
    </View>
  );

  const renderHeader = () => (
    <View className="bg-gray-50 p-4">
      <TextInput
        className="rounded-lg border border-gray-200 bg-white px-4 py-3"
        placeholder="Search todos..."
        value={searchQuery}
        onChangeText={handleSearch}
      />
    </View>
  );

  return (
    <Container>
      <View className="flex-1 bg-gray-50">
        <FlatList
          data={state.todos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderTodoItem}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmpty}
          refreshControl={<RefreshControl refreshing={state.refreshing} onRefresh={refreshTodos} />}
          contentContainerStyle={state.todos.length === 0 ? { flex: 1 } : {}}
        />

        {/* Add Todo FAB */}
        <TouchableOpacity
          className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-blue-500 shadow-lg"
          onPress={() => navigation.navigate('AddTodo')}>
          <Text className="text-2xl font-bold text-white">+</Text>
        </TouchableOpacity>

        {/* Loading overlay */}
        {state.loading && !state.refreshing && (
          <View className="absolute inset-0 items-center justify-center bg-black bg-opacity-50">
            <Text className="text-white">Loading...</Text>
          </View>
        )}

        {/* Error message */}
        {state.error && (
          <View className="absolute left-4 right-4 top-4 rounded-lg bg-red-500 p-3">
            <Text className="text-white">{state.error}</Text>
            <TouchableOpacity className="mt-2" onPress={() => fetchTodos()}>
              <Text className="text-white underline">Retry</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Container>
  );
}
