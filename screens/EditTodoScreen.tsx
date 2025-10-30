import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useTodo } from '../context/TodoContext';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Container } from '../components/Container';

type EditTodoScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'EditTodo'>;

type EditTodoScreenRouteProp = RouteProp<RootStackParamList, 'EditTodo'>;

export default function EditTodoScreen() {
  const navigation = useNavigation<EditTodoScreenNavigationProp>();
  const route = useRoute<EditTodoScreenRouteProp>();
  const { getTodo, updateTodo } = useTodo();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { id } = route.params;

  const loadTodo = useCallback(async () => {
    try {
      setInitialLoading(true);
      setError(null);
      const todo = await getTodo(id);
      setTitle(todo.title);
      setDescription(todo.description || '');
    } catch {
      setError('Failed to load todo for editing');
    } finally {
      setInitialLoading(false);
    }
  }, [getTodo, id]);

  useEffect(() => {
    loadTodo();
  }, [loadTodo]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for your todo');
      return;
    }

    setLoading(true);
    try {
      await updateTodo(id, {
        title: title.trim(),
        description: description.trim() || undefined,
      });

      // Navigate back to todo detail
      navigation.goBack();
    } catch {
      Alert.alert('Error', 'Failed to update todo. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  if (initialLoading) {
    return (
      <Container>
        <View className="flex-1 items-center justify-center">
          <View className="items-center rounded-2xl bg-white p-6 shadow-lg">
            <Text className="mb-2 text-lg font-medium text-gray-700">Loading todo...</Text>
            <Text className="text-sm text-gray-500">Please wait</Text>
          </View>
        </View>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <View className="flex-1 items-center justify-center">
          <View className="mb-6 h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <Text className="text-2xl">⚠️</Text>
          </View>
          <Text className="mb-4 text-center text-xl font-semibold text-red-700">{error}</Text>
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
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="mb-8 mt-4">
            <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <Text className="text-2xl">✏️</Text>
            </View>
            <Text className="mb-2 text-3xl font-bold text-gray-900">Edit Todo</Text>
            <Text className="text-lg text-gray-600">Update your todo details below</Text>
          </View>

          <View className="mb-6">
            <Text className="mb-3 text-base font-semibold text-gray-800">Title *</Text>
            <View className="rounded-2xl bg-white p-1 shadow-sm">
              <TextInput
                className="rounded-xl bg-gray-50 px-4 py-4 text-base text-gray-900"
                placeholder="Enter todo title..."
                placeholderTextColor="#9CA3AF"
                value={title}
                onChangeText={setTitle}
                maxLength={100}
                autoFocus
              />
            </View>
          </View>

          <View className="mb-8">
            <Text className="mb-3 text-base font-semibold text-gray-800">
              Description (Optional)
            </Text>
            <View className="rounded-2xl bg-white p-1 shadow-sm">
              <TextInput
                className="min-h-[120px] rounded-xl bg-gray-50 px-4 py-4 text-base text-gray-900"
                placeholder="Enter todo description..."
                placeholderTextColor="#9CA3AF"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                maxLength={500}
              />
            </View>
          </View>

          <View className="flex-row gap-x-4">
            <TouchableOpacity
              className="flex-1 items-center rounded-2xl bg-white py-4 shadow-sm"
              onPress={handleCancel}
              disabled={loading}>
              <Text className="text-base font-semibold text-gray-700">Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`flex-1 items-center rounded-2xl py-4 shadow-lg ${
                title.trim() ? 'bg-blue-500' : 'bg-gray-300'
              }`}
              onPress={handleSubmit}
              disabled={loading || !title.trim()}>
              <Text className="text-base font-semibold text-white">
                {loading ? 'Updating...' : 'Update Todo'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
}
