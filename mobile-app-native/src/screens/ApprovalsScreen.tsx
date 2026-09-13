import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { api } from '../api';
import { useWorkspaceStore } from '../store/useWorkspaceStore';

export const ApprovalsScreen = () => {
  const { workspaceId } = useWorkspaceStore();
  const [approvals, setApprovals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchApprovals = async () => {
    if (!workspaceId) {
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      setError('');
      const res = await api.get(`/api/ai-agent/workspaces/${workspaceId}/approvals`);
      if (res.data?.success) {
        setApprovals(res.data.data);
      } else {
        setError('Failed to fetch approvals');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error fetching approvals');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, [workspaceId]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchApprovals();
  };

  const handleResolve = async (approvalId: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      const res = await api.post(`/api/ai-agent/workspaces/${workspaceId}/approvals/${approvalId}/resolve`, {
        status,
        reason: `Mobile ${status.toLowerCase()}`
      });
      if (res.data?.success) {
        Alert.alert('Success', `Approval ${status.toLowerCase()} successfully`);
        fetchApprovals(); // Refresh the list
      } else {
        Alert.alert('Error', 'Failed to resolve approval');
      }
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to resolve approval');
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Text style={styles.title}>Approval for Task: {item.taskId}</Text>
      <Text style={styles.subtitle}>Status: {item.status}</Text>

      {item.status === 'PENDING' && (
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.approveButton]}
            onPress={() => handleResolve(item._id, 'APPROVED')}
          >
            <Text style={styles.buttonText}>Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.rejectButton]}
            onPress={() => handleResolve(item._id, 'REJECTED')}
          >
            <Text style={styles.buttonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      )}
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
          data={approvals}
          keyExtractor={(item, index) => item._id || index.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View style={styles.center}>
               <Text style={styles.emptyText}>No approvals pending or available.</Text>
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
  subtitle: { fontSize: 14, color: '#6b7280', marginTop: 4, marginBottom: 12 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between' },
  button: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center' },
  approveButton: { backgroundColor: '#10b981', marginRight: 8 },
  rejectButton: { backgroundColor: '#ef4444', marginLeft: 8 },
  buttonText: { color: '#fff', fontWeight: '600' },
  emptyText: { color: '#6b7280', fontSize: 16, textAlign: 'center' },
  error: { color: '#ef4444', fontSize: 16, textAlign: 'center' }
});