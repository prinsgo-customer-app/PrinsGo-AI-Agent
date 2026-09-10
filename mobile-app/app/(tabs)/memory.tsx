import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, RefreshControl, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Brain, Plus } from 'lucide-react-native';
import api from '../../src/lib/api';
import { useAuthStore } from '../../src/store/authStore';
import { useMemoryStore } from '../../src/store/memoryStore';

export default function MemoryScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [newMemoryContent, setNewMemoryContent] = useState('');
  const [addingMemory, setAddingMemory] = useState(false);

  const workspaceId = useAuthStore(state => state.workspaceId);
  const user = useAuthStore(state => state.user);

  const memories = useMemoryStore(state => state.memories);
  const setMemories = useMemoryStore(state => state.setMemories);
  const addMemory = useMemoryStore(state => state.addMemory);

  const fetchMemories = useCallback(async () => {
    try {
      const res = await api.get(`/ai-agent/memory?workspaceId=${workspaceId}`);
      setMemories(res.data.memories || []);
      setErrorMsg('');
    } catch (error) {
      console.error(error);
      setErrorMsg('Failed to load memories. Pull to refresh.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [workspaceId, setMemories]);

  useEffect(() => {
    fetchMemories();
  }, [fetchMemories]);

  const handleAddMemory = async () => {
    if (!newMemoryContent.trim()) return;
    setAddingMemory(true);

    try {
      const res = await api.post('/ai-agent/memory', {
        workspaceId,
        userId: user?._id || user?.id,
        type: 'RULE',
        content: newMemoryContent
      });
      addMemory(res.data.memory);
      setNewMemoryContent('');
    } catch (error) {
      console.error(error);
      setErrorMsg('Failed to add memory.');
    } finally {
      setAddingMemory(false);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{item.type || 'KNOWLEDGE'}</Text>
      </View>
      <Text style={styles.content}>{item.content}</Text>
      <Text style={styles.dateText}>
        {new Date(item.createdAt).toLocaleDateString()}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Brain color="#10b981" size={24} style={styles.headerIcon} />
          <Text style={styles.headerTitle}>Memory & Knowledge</Text>
        </View>

        {errorMsg ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        ) : null}

        {loading ? (
          <ActivityIndicator size="large" color="#10b981" style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            data={memories}
            keyExtractor={(item: any) => item._id || Math.random().toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchMemories(); }} />}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No memories added yet.</Text>
              </View>
            }
          />
        )}

        <View style={styles.inputArea}>
          <TextInput
            style={styles.input}
            placeholder="Add Knowledge or Rules..."
            value={newMemoryContent}
            onChangeText={setNewMemoryContent}
            multiline
          />
          <TouchableOpacity
            style={[styles.addButton, (!newMemoryContent.trim() || addingMemory) && styles.addButtonDisabled]}
            onPress={handleAddMemory}
            disabled={!newMemoryContent.trim() || addingMemory}
          >
            {addingMemory ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Plus color="#ffffff" size={20} />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  headerIcon: { marginRight: 8 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
  errorBox: { margin: 16, padding: 12, backgroundColor: '#fef2f2', borderRadius: 8 },
  errorText: { color: '#ef4444', fontSize: 14 },
  listContainer: { padding: 16, gap: 12 },
  card: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  badge: { alignSelf: 'flex-start', backgroundColor: '#f3f4f6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, marginBottom: 8 },
  badgeText: { fontSize: 10, fontWeight: '600', color: '#4b5563' },
  content: { fontSize: 14, color: '#111827', marginBottom: 8, lineHeight: 20 },
  dateText: { fontSize: 12, color: '#9ca3af' },
  inputArea: { flexDirection: 'row', alignItems: 'flex-end', padding: 16, borderTopWidth: 1, borderTopColor: '#f3f4f6', backgroundColor: '#ffffff' },
  input: { flex: 1, backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, minHeight: 44, maxHeight: 120, color: '#111827', marginRight: 12 },
  addButton: { width: 44, height: 44, backgroundColor: '#10b981', borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  addButtonDisabled: { opacity: 0.5 },
  emptyContainer: { padding: 32, alignItems: 'center' },
  emptyText: { fontSize: 14, color: '#6b7280' },
});
