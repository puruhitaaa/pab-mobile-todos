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
        <View className="flex-1 items-center justify-center bg-gray-50">
          <Text className="text-gray-600">Loading todo...</Text>
        </View>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <View className="flex-1 items-center justify-center bg-gray-50">
          <Text className="mb-4 text-center text-red-500">{error}</Text>
          <TouchableOpacity className="rounded-lg bg-blue-500 px-6 py-3" onPress={loadTodo}>
            <Text className="font-medium text-white">Retry</Text>
          </TouchableOpacity>
        </View>
      </Container>
    );
  }

  return (
    <Container>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 bg-gray-50">
        <ScrollView className="flex-1">
          <View className="mb-6">
            <Text className="mb-2 text-2xl font-bold text-gray-900">Edit Todo</Text>
            <Text className="text-gray-600">Update your todo details below</Text>
          </View>

          <View className="mb-4">
            <Text className="mb-2 text-sm font-medium text-gray-700">Title *</Text>
            <TextInput
              className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-base"
              placeholder="Enter todo title..."
              value={title}
              onChangeText={setTitle}
              maxLength={100}
              autoFocus
            />
          </View>

          <View className="mb-6">
            <Text className="mb-2 text-sm font-medium text-gray-700">Description (Optional)</Text>
            <TextInput
              className="min-h-[100px] rounded-lg border border-gray-200 bg-white px-4 py-3 text-base"
              placeholder="Enter todo description..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              maxLength={500}
            />
          </View>

          <View className="flex-row space-x-3">
            <TouchableOpacity
              className="flex-1 items-center rounded-lg bg-gray-200 py-3"
              onPress={handleCancel}
              disabled={loading}>
              <Text className="font-medium text-gray-700">Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 items-center rounded-lg bg-blue-500 py-3"
              onPress={handleSubmit}
              disabled={loading || !title.trim()}>
              <Text className="font-medium text-white">
                {loading ? 'Updating...' : 'Update Todo'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
}
