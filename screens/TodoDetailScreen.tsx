import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Alert, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useTodo } from '../context/TodoContext';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Todo } from '../services/api';

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
      <SafeAreaView className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-gray-600">Loading todo details...</Text>
      </SafeAreaView>
    );
  }

  if (error || !todo) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 p-4">
        <View className="flex-1 items-center justify-center">
          <Text className="mb-4 text-center text-red-500">{error || 'Todo not found'}</Text>
          <TouchableOpacity className="rounded-lg bg-blue-500 px-6 py-3" onPress={loadTodo}>
            <Text className="font-medium text-white">Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 p-4">
        {/* Header */}
        <View className="mb-6">
          <Text className="mb-2 text-3xl font-bold text-gray-900">{todo.title}</Text>
          <View className="mb-4 flex-row items-center">
            <View
              className={`mr-2 h-3 w-3 rounded-full ${
                todo.completed ? 'bg-green-500' : 'bg-yellow-500'
              }`}
            />
            <Text className="text-sm text-gray-600">
              {todo.completed ? 'Completed' : 'Pending'}
            </Text>
          </View>
        </View>

        {/* Description */}
        {todo.description && (
          <View className="mb-6">
            <Text className="mb-2 text-lg font-semibold text-gray-800">Description</Text>
            <Text className="text-base leading-6 text-gray-700">{todo.description}</Text>
          </View>
        )}

        {/* Metadata */}
        <View className="mb-8">
          <Text className="mb-3 text-lg font-semibold text-gray-800">Details</Text>
          <View className="rounded-lg border border-gray-200 bg-white p-4">
            <View className="mb-2 flex-row justify-between">
              <Text className="text-gray-600">Created:</Text>
              <Text className="text-gray-900">{new Date(todo.createdAt).toLocaleDateString()}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Status:</Text>
              <Text
                className={`font-medium ${todo.completed ? 'text-green-600' : 'text-yellow-600'}`}>
                {todo.completed ? 'Completed' : 'Pending'}
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="space-y-3">
          <TouchableOpacity
            className={`items-center rounded-lg px-6 py-4 ${
              todo.completed ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            onPress={handleToggleComplete}>
            <Text className="text-lg font-medium text-white">
              {todo.completed ? 'Mark as Pending' : 'Mark as Complete'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="items-center rounded-lg bg-blue-500 px-6 py-4"
            onPress={handleEdit}>
            <Text className="text-lg font-medium text-white">Edit Todo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="items-center rounded-lg bg-red-500 px-6 py-4"
            onPress={handleDelete}>
            <Text className="text-lg font-medium text-white">Delete Todo</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
