import React, { useState } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { useTodo } from '../context/TodoContext';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Container } from '../components/Container';

type AddTodoScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddTodo'>;

export default function AddTodoScreen() {
  const navigation = useNavigation<AddTodoScreenNavigationProp>();
  const { createTodo } = useTodo();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for your todo');
      return;
    }

    setLoading(true);
    try {
      await createTodo({
        title: title.trim(),
        description: description.trim() || undefined,
      });

      // Navigate back to todo list
      navigation.goBack();
    } catch {
      Alert.alert('Error', 'Failed to create todo. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <Container>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 bg-gray-50">
        <ScrollView className="flex-1">
          <View className="mb-6">
            <Text className="mb-2 text-2xl font-bold text-gray-900">Add New Todo</Text>
            <Text className="text-gray-600">Create a new task to add to your todo list</Text>
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
                {loading ? 'Creating...' : 'Create Todo'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
}
