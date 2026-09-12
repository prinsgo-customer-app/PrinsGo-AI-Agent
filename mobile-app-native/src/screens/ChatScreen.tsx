import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { api } from '../api';
import { useWorkspaceStore } from '../store/useWorkspaceStore';
import { Send } from 'lucide-react-native';

export const ChatScreen = ({ route }: any) => {
  const agentId = route.params?.agentId || '';
  const agentName = route.params?.agentName || 'Agent';
  const { workspaceId } = useWorkspaceStore();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // In a real implementation we would fetch history here if the API supported it
  useEffect(() => {
     setMessages([{ id: '1', role: 'system', text: `Chat with ${agentName} started.` }]);
  }, [agentName]);

  const handleSend = async () => {
    if (!input.trim() || !workspaceId || !agentId) return;

    const userMessage = { id: Date.now().toString(), role: 'user', text: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Send task creation
      const res = await api.post(`/api/ai-agent/workspaces/${workspaceId}/tasks`, {
        agentId,
        instructions: userMessage.text,
        requiresApproval: false, // Simplifying for chat
        requiredPermissions: []
      });

      if (res.data?.success && res.data?.data?._id) {
         const taskId = res.data.data._id;

         // Execute task
         const execRes = await api.post(`/api/ai-agent/workspaces/${workspaceId}/tasks/${taskId}/execute`);
         if (execRes.data?.success) {
             const aiResponse = execRes.data.data.result || 'Task executed (No direct text result)';
             setMessages(prev => [...prev, { id: Date.now().toString(), role: 'ai', text: aiResponse }]);
         } else {
             setMessages(prev => [...prev, { id: Date.now().toString(), role: 'error', text: 'Task execution failed.' }]);
         }
      } else {
          setMessages(prev => [...prev, { id: Date.now().toString(), role: 'error', text: 'Task creation failed.' }]);
      }
    } catch (error: any) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'error', text: error.message || 'An error occurred.' }]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = ({ item }: { item: any }) => (
    <View style={[
      styles.messageBubble,
      item.role === 'user' ? styles.userBubble :
      item.role === 'error' ? styles.errorBubble : styles.aiBubble
    ]}>
      <Text style={[
        styles.messageText,
        item.role === 'user' ? styles.userText :
        item.role === 'error' ? styles.errorText : styles.aiText
      ]}>
        {item.text}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
         <Text style={styles.headerText}>{agentName}</Text>
      </View>
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.chatContainer}
        inverted={false}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type a message..."
          editable={!loading}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend} disabled={loading || !input.trim()}>
          {loading ? <ActivityIndicator color="#fff" /> : <Send color="#fff" size={20} />}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#e5e7eb', alignItems: 'center' },
  headerText: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  chatContainer: { padding: 16, paddingBottom: 32 },
  messageBubble: { maxWidth: '80%', padding: 12, borderRadius: 16, marginBottom: 8 },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#10b981', borderBottomRightRadius: 4 },
  aiBubble: { alignSelf: 'flex-start', backgroundColor: '#e5e7eb', borderBottomLeftRadius: 4 },
  errorBubble: { alignSelf: 'center', backgroundColor: '#fee2e2' },
  messageText: { fontSize: 16 },
  userText: { color: '#fff' },
  aiText: { color: '#1f2937' },
  errorText: { color: '#ef4444', fontSize: 14 },
  inputContainer: { flexDirection: 'row', padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#e5e7eb', alignItems: 'center' },
  input: { flex: 1, backgroundColor: '#f3f4f6', padding: 12, borderRadius: 20, fontSize: 16, marginRight: 8, maxHeight: 100 },
  sendButton: { backgroundColor: '#10b981', width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' }
});
