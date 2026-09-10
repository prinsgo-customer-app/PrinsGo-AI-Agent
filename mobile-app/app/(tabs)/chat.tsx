import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bot, Send, Paperclip, Command } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import api from '../../src/lib/api';
import { useAuthStore } from '../../src/store/authStore';

type Message = {
  id: string;
  role: 'user' | 'ai';
  content: string;
  status?: string;
};

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'ai', content: 'Hello! I am your PrinsGo AI Agent. How can I assist you with your projects today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const workspaceId = useAuthStore(state => state.workspaceId);
  const flatListRef = useRef<FlatList>(null);

  const appendAiMessage = (content: string, status: string = 'COMPLETED') => {
    setMessages(prev => [...prev, {
      id: Date.now().toString() + Math.random(),
      role: 'ai',
      content,
      status
    }]);
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userContent = input;
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: userContent }]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/ai-agent/chat', {
        message: userContent,
        workspaceId
      });

      appendAiMessage(res.data?.response, res.data?.status);
    } catch (error: any) {
      console.error(error);
      appendAiMessage('Failed to process command. The AI Agent backend is currently UNAVAILABLE.', 'ERROR');
    } finally {
      setLoading(false);
    }
  };

  const handleAttachImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        appendAiMessage('Permission to access camera roll is required!', 'ERROR');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'user',
          content: `[Attached Image: ${result.assets[0].fileName || 'screenshot.jpg'}]`
        }]);

        appendAiMessage('Image analysis and vision endpoints are currently NOT_CONFIGURED on this backend.', 'ERROR');
      }
    } catch (err) {
      console.error(err);
      appendAiMessage('Failed to select image.', 'ERROR');
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.role === 'user';
    return (
      <View style={[styles.messageWrapper, isUser ? styles.messageWrapperUser : styles.messageWrapperAi]}>
        {!isUser && (
          <View style={styles.aiAvatar}>
            <Bot color="#ffffff" size={16} />
          </View>
        )}
        <View style={[styles.messageBubble, isUser ? styles.messageBubbleUser : styles.messageBubbleAi]}>
          <Text style={[styles.messageText, isUser ? styles.messageTextUser : styles.messageTextAi]}>
            {item.content}
          </Text>
          {item.status && (
            <Text style={[styles.statusText, item.status === 'ERROR' ? { color: '#ef4444' } : {}]}>
              Status: {item.status}
            </Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Command color="#059669" size={24} />
          </View>
          <View>
            <Text style={styles.headerTitle}>AI Command Center</Text>
            <Text style={styles.headerSubtitle}>Natural language control</Text>
          </View>
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.chatContainer}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        <View style={styles.inputArea}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Give a command..."
              value={input}
              onChangeText={setInput}
              multiline
            />
            <TouchableOpacity style={styles.attachButton} onPress={handleAttachImage} disabled={loading}>
              <Paperclip color="#6b7280" size={20} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sendButton, (!input.trim() || loading) && styles.sendButtonDisabled]}
              onPress={handleSend}
              disabled={!input.trim() || loading}
            >
              {loading ? <ActivityIndicator color="#ffffff" size="small" /> : <Send color="#ffffff" size={16} />}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  keyboardView: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6', backgroundColor: '#ffffff' },
  headerIcon: { width: 40, height: 40, borderRadius: 8, backgroundColor: '#d1fae5', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  headerSubtitle: { fontSize: 12, color: '#6b7280' },
  chatContainer: { padding: 16, paddingBottom: 24, gap: 16 },
  messageWrapper: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 16 },
  messageWrapperUser: { justifyContent: 'flex-end' },
  messageWrapperAi: { justifyContent: 'flex-start' },
  aiAvatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#10b981', justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  messageBubble: { maxWidth: '80%', padding: 12, borderRadius: 16 },
  messageBubbleUser: { backgroundColor: '#111827', borderBottomRightRadius: 4 },
  messageBubbleAi: { backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderBottomLeftRadius: 4 },
  messageText: { fontSize: 14, lineHeight: 20 },
  messageTextUser: { color: '#ffffff' },
  messageTextAi: { color: '#374151' },
  statusText: { fontSize: 10, color: '#d97706', marginTop: 6, fontWeight: '600' },
  inputArea: { padding: 12, paddingBottom: Platform.OS === 'ios' ? 12 : 24, backgroundColor: '#ffffff', borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 24, paddingHorizontal: 12, paddingVertical: 6 },
  input: { flex: 1, minHeight: 36, maxHeight: 100, color: '#111827', paddingTop: 8, paddingBottom: 8 },
  attachButton: { padding: 8 },
  sendButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#10b981', justifyContent: 'center', alignItems: 'center', marginLeft: 4 },
  sendButtonDisabled: { opacity: 0.5 },
});
