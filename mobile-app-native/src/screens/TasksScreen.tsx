import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { api } from '../api';
import { useWorkspaceStore } from '../store/useWorkspaceStore';

export const TasksScreen = () => {
  const { workspaceId } = useWorkspaceStore();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTasks = async () => {
    if (!workspaceId) {
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      // NOTE: backend API might not actually expose GET /tasks. Checking if it succeeds.
      const res = await api.get(`/api/ai-agent/workspaces/${workspaceId}/tasks`);
      if (res.data?.success) {
        setTasks(res.data.data);
      }
    } catch (error) {
       // Ignore if not implemented on backend
       console.log('Tasks fetch error (maybe not configured):', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [workspaceId]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTasks();
  };

  const renderTask = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Text style={styles.title}>Task: {item.instructions || 'No instructions'}</Text>
      <Text style={styles.status}>Status: {item.status}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.center}><ActivityIndicator size="large" color="#10b981" /></View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item, index) => item._id || index.toString()}
          renderItem={renderTask}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View style={styles.center}>
               <Text style={styles.emptyText}>Tasks API is NOT_CONFIGURED or empty.</Text>
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
  title: { fontSize: 16, fontWeight: 'bold', color: '#111827' },
  status: { fontSize: 14, color: '#6b7280', marginTop: 4 },
  emptyText: { color: '#6b7280', fontSize: 16, textAlign: 'center' }
});
