import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useTodo } from '../context/TodoContext';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Todo } from '../services/api';
import { Container } from '../components/Container';

type TodoDetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TodoDetail'>;

type TodoDetailScreenRouteProp = RouteProp<RootStackParamList, 'TodoDetail'>;

export default function TodoDetailScreen() {
  const navigation = useNavigation<TodoDetailScreenNavigationProp>();
  const route = useRoute<TodoDetailScreenRouteProp>();
  const { getTodo, toggleTodo, deleteTodo } = useTodo();
  const [todo, setTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { id } = route.params;

  const loadTodo = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const todoData = await getTodo(id);
      setTodo(todoData);
    } catch {
      setError('Failed to load todo details');
    } finally {
      setLoading(false);
    }
  }, [getTodo, id]);

  useEffect(() => {
    loadTodo();
  }, [loadTodo]);

  const handleToggleComplete = async () => {
    if (!todo) return;

    try {
      await toggleTodo(todo.id);
      // Update local state optimistically
      setTodo({ ...todo, completed: !todo.completed });
    } catch {
      Alert.alert('Error', 'Failed to update todo status');
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete Todo', 'Are you sure you want to delete this todo?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteTodo(id);
            navigation.goBack();
          } catch {
            Alert.alert('Error', 'Failed to delete todo');
          }
        },
      },
    ]);
  };

  const handleEdit = () => {
    if (todo) {
      navigation.navigate('EditTodo', { id: todo.id });
    }
  };

  if (loading) {
    return (
      <Container>
        <View className="flex-1 items-center justify-center bg-gray-50">
          <View className="items-center rounded-2xl bg-white p-6 shadow-lg">
            <Text className="mb-2 text-lg font-medium text-gray-700">Loading todo details...</Text>
            <Text className="text-sm text-gray-500">Please wait</Text>
          </View>
        </View>
      </Container>
    );
  }

  if (error || !todo) {
    return (
      <Container>
        <View className="flex-1 items-center justify-center bg-gray-50">
          <View className="mb-6 h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <Text className="text-2xl">⚠️</Text>
          </View>
          <Text className="mb-4 text-center text-xl font-semibold text-red-700">
            {error || 'Todo not found'}
          </Text>
          <TouchableOpacity
            className="rounded-2xl bg-red-500 px-8 py-4 shadow-lg"
            onPress={loadTodo}>
            <Text className="text-base font-semibold text-white">Try Again</Text>
          </TouchableOpacity>
        </View>
      </Container>
    );
  }

  return (
    <Container>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="mb-8 mt-4">
          <View className="mb-4 flex-row items-center">
            <View
              className={`mr-3 h-4 w-4 rounded-full ${
                todo.completed ? 'bg-green-500' : 'bg-yellow-500'
              }`}
            />
            <Text className="text-sm font-medium uppercase tracking-wide text-gray-600">
              {todo.completed ? 'Completed' : 'Pending'}
            </Text>
          </View>
          <Text className="mb-4 text-4xl font-bold leading-tight text-gray-900">{todo.title}</Text>
        </View>

        {/* Description */}
        {todo.description && (
          <View className="mb-8">
            <Text className="mb-4 text-xl font-semibold text-gray-800">Description</Text>
            <View className="rounded-2xl bg-white p-6 shadow-sm">
              <Text className="text-base leading-7 text-gray-700">{todo.description}</Text>
            </View>
          </View>
        )}

        {/* Metadata */}
        <View className="mb-10">
          <Text className="mb-4 text-xl font-semibold text-gray-800">Details</Text>
          <View className="rounded-2xl bg-white p-6 shadow-sm">
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-base text-gray-600">Created</Text>
              <Text className="text-base font-medium text-gray-900">
                {new Date(todo.createdAt).toLocaleDateString()}
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-base text-gray-600">Status</Text>
              <View className="flex-row items-center">
                <View
                  className={`mr-2 h-2 w-2 rounded-full ${
                    todo.completed ? 'bg-green-500' : 'bg-yellow-500'
                  }`}
                />
                <Text
                  className={`text-base font-medium ${
                    todo.completed ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                  {todo.completed ? 'Completed' : 'Pending'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="gap-y-4">
          <TouchableOpacity
            className={`items-center rounded-2xl px-2 py-3 shadow-lg ${
              todo.completed ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            onPress={handleToggleComplete}>
            <Text className="text-lg font-semibold text-white">
              {todo.completed ? 'Mark as Pending' : 'Mark as Complete'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="items-center rounded-2xl bg-blue-500 px-2 py-3 shadow-lg"
            onPress={handleEdit}>
            <Text className="text-lg font-semibold text-white">Edit Todo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="items-center rounded-2xl bg-red-500 px-2 py-3 shadow-lg"
            onPress={handleDelete}>
            <Text className="text-lg font-semibold text-white">Delete Todo</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Container>
  );
}
