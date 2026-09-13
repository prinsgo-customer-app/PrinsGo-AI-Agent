import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { api } from '../api';
import { useWorkspaceStore } from '../store/useWorkspaceStore';

export const MemoryScreen = () => {
  const { workspaceId } = useWorkspaceStore();
  const [memories, setMemories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchMemories = async () => {
    if (!workspaceId) {
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      setError('');
      const res = await api.get(`/api/ai-agent/workspaces/${workspaceId}/memory`);
      if (res.data?.success) {
        setMemories(res.data.data);
      } else {
        setError('Failed to fetch memories');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error fetching memories');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMemories();
  }, [workspaceId]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchMemories();
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Text style={styles.key}>Key: {item.key}</Text>
      <Text style={styles.type}>Type: {item.type}</Text>
      <Text style={styles.content}>Value: {JSON.stringify(item.content)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.center}><ActivityIndicator size="large" color="#10b981" /></View>
      ) : error ? (
        <View style={styles.center}><Text style={styles.error}>{error}</Text></View>
      ) : (
        <FlatList
          data={memories}
          keyExtractor={(item, index) => item._id || index.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View style={styles.center}>
               <Text style={styles.emptyText}>No memories configured or available.</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  list: { padding: 16 },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, elevation: 2 },
  key: { fontSize: 16, fontWeight: 'bold', color: '#111827' },
  type: { fontSize: 14, color: '#6b7280', marginTop: 4 },
  content: { fontSize: 14, color: '#4b5563', marginTop: 8 },
  emptyText: { color: '#6b7280', fontSize: 16, textAlign: 'center' },
  error: { color: '#ef4444', fontSize: 16, textAlign: 'center' }
});