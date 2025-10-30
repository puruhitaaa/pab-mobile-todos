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
      className="mx-4 mb-3 rounded-2xl bg-white p-4 shadow-sm"
      onPress={() => navigation.navigate('TodoDetail', { id: item.id })}>
      <View className="flex-row items-center justify-between">
        <View className="flex-1 flex-row items-center">
          <TouchableOpacity
            className={`mr-3 h-6 w-6 items-center justify-center rounded-full border-2 ${
              item.completed ? 'border-green-500 bg-green-500' : 'border-gray-300 bg-white'
            }`}
            onPress={() => handleToggleTodo(item.id)}>
            {item.completed && <Text className="text-xs text-white">✓</Text>}
          </TouchableOpacity>

          <View className="flex-1">
            <Text
              className={`text-base font-semibold ${
                item.completed ? 'text-gray-400 line-through' : 'text-gray-900'
              }`}>
              {item.title}
            </Text>
            {item.description && (
              <Text
                className={`mt-1 text-sm ${item.completed ? 'text-gray-300' : 'text-gray-600'}`}
                numberOfLines={2}>
                {item.description}
              </Text>
            )}
          </View>
        </View>

        <TouchableOpacity
          className="ml-2 rounded-xl bg-red-50 px-3 py-2"
          onPress={() => handleDeleteTodo(item.id)}>
          <Text className="text-sm font-medium text-red-600">Delete</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View className="flex-1 items-center justify-center py-16">
      <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-gray-100">
        <Text className="text-2xl">📝</Text>
      </View>
      <Text className="mb-2 text-xl font-semibold text-gray-700">No todos yet</Text>
      <Text className="px-8 text-center leading-6 text-gray-500">
        Tap the + button to add your first todo and start organizing your tasks
      </Text>
    </View>
  );

  const renderHeader = () => (
    <View className="mb-4 bg-white p-4 shadow-sm">
      <View className="flex-row items-center rounded-2xl bg-gray-50 px-4 py-3">
        <Text className="mr-3 text-gray-400">🔍</Text>
        <TextInput
          className="flex-1 text-base text-gray-900"
          placeholder="Search todos..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
    </View>
  );

  return (
    <Container>
      <View className="flex-1">
        <FlatList
          data={state.todos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderTodoItem}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmpty}
          refreshControl={<RefreshControl refreshing={state.refreshing} onRefresh={refreshTodos} />}
          contentContainerStyle={
            state.todos.length === 0 ? { flex: 1 } : { paddingTop: 8, paddingBottom: 100 }
          }
          showsVerticalScrollIndicator={false}
        />

        {/* Add Todo FAB */}
        <TouchableOpacity
          className="elevation-8 absolute bottom-8 right-6 h-16 w-16 items-center justify-center rounded-full bg-blue-500 shadow-2xl"
          onPress={() => navigation.navigate('AddTodo')}>
          <Text className="text-3xl font-bold text-white">+</Text>
        </TouchableOpacity>

        {/* Loading overlay */}
        {state.loading && !state.refreshing && (
          <View className="absolute inset-0 items-center justify-center bg-white bg-opacity-95">
            <View className="items-center rounded-2xl bg-white p-6 shadow-lg">
              <Text className="mb-2 text-lg font-medium text-gray-700">Loading...</Text>
              <Text className="text-sm text-gray-500">Fetching your todos</Text>
            </View>
          </View>
        )}

        {/* Error message */}
        {state.error && (
          <View className="absolute left-6 right-6 top-6 rounded-2xl border border-red-200 bg-red-50 p-4 shadow-lg">
            <Text className="mb-2 font-medium text-red-800">Oops! Something went wrong</Text>
            <Text className="mb-3 text-sm text-red-700">{state.error}</Text>
            <TouchableOpacity
              className="self-start rounded-xl bg-red-500 px-4 py-2"
              onPress={() => fetchTodos()}>
              <Text className="text-sm font-medium text-white">Try Again</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Container>
  );
}
