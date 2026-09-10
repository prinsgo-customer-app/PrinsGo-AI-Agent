import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../src/lib/api';
import { useAuthStore } from '../../src/store/authStore';
import { CheckSquare } from 'lucide-react-native';

type Task = {
  _id: string;
  description: string;
  status: string;
  createdAt: string;
  result?: { text: string };
};

export default function TasksScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const workspaceId = useAuthStore(state => state.workspaceId);

  const fetchTasks = async () => {
    try {
      const res = await api.get(`/ai-agent/tasks?workspaceId=${workspaceId}`);
      setTasks(res.data.tasks || []);
      setErrorMsg('');
    } catch (error) {
      console.error(error);
      setErrorMsg('Failed to load tasks. Pull to refresh.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [workspaceId]);

  const renderItem = ({ item }: { item: Task }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.description}</Text>
        <View style={[styles.badge, item.status === 'COMPLETED' ? styles.badgeSuccess : styles.badgeNeutral]}>
          <Text style={[styles.badgeText, item.status === 'COMPLETED' ? styles.badgeTextSuccess : styles.badgeTextNeutral]}>
            {item.status}
          </Text>
        </View>
      </View>
      <Text style={styles.dateText}>Started: {new Date(item.createdAt).toLocaleString()}</Text>
      {item.result?.text ? (
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>{item.result.text}</Text>
        </View>
      ) : null}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <CheckSquare color="#10b981" size={24} style={styles.headerIcon} />
        <Text style={styles.headerTitle}>Tasks</Text>
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
          data={tasks}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchTasks(); }} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No tasks found for this workspace.</Text>
            </View>
          }
        />
      )}
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
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#111827', flex: 1, marginRight: 8 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 16 },
  badgeSuccess: { backgroundColor: '#d1fae5' },
  badgeNeutral: { backgroundColor: '#f3f4f6' },
  badgeText: { fontSize: 10, fontWeight: '600' },
  badgeTextSuccess: { color: '#059669' },
  badgeTextNeutral: { color: '#4b5563' },
  dateText: { fontSize: 12, color: '#6b7280' },
  resultBox: { marginTop: 12, padding: 12, backgroundColor: '#f9fafb', borderRadius: 8, borderWidth: 1, borderColor: '#f3f4f6' },
  resultText: { fontSize: 12, color: '#374151' },
  emptyContainer: { padding: 32, alignItems: 'center' },
  emptyText: { fontSize: 14, color: '#6b7280' },
});
