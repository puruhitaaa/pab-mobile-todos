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
        className="flex-1">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="mb-8 mt-4">
            <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <Text className="text-2xl">✨</Text>
            </View>
            <Text className="mb-2 text-3xl font-bold text-gray-900">Add New Todo</Text>
            <Text className="text-lg text-gray-600">
              Create a new task to add to your todo list
            </Text>
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
                {loading ? 'Creating...' : 'Create Todo'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
}
