import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../src/lib/api';
import { useAuthStore } from '../../src/store/authStore';
import { ShieldCheck } from 'lucide-react-native';

type Approval = {
  _id: string;
  actionType: string;
  description: string;
  riskLevel: string;
  status: string;
};

export default function ApprovalsScreen() {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  const workspaceId = useAuthStore(state => state.workspaceId);

  const fetchApprovals = useCallback(async () => {
    try {
      const res = await api.get(`/ai-agent/admin/approvals?workspaceId=${workspaceId}`);
      setApprovals(res.data.approvals || []);
      setErrorMsg('');
    } catch (error) {
      console.error(error);
      setErrorMsg('Failed to load approvals. Pull to refresh.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    fetchApprovals();
  }, [fetchApprovals]);

  const handleResolve = async (id: string, status: string) => {
    setResolvingId(id);
    try {
      await api.post(`/ai-agent/admin/approvals/${id}/resolve`, { status });
      await fetchApprovals();
    } catch (e) {
      console.error(e);
      setApprovals(prev => prev.filter(a => a._id !== id));
    } finally {
      setResolvingId(null);
    }
  };

  const renderItem = ({ item }: { item: Approval }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Action: {item.actionType}</Text>
        <View style={styles.riskBadge}>
          <Text style={styles.riskBadgeText}>Risk: {item.riskLevel}</Text>
        </View>
      </View>
      <Text style={styles.description}>{item.description}</Text>

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[styles.button, styles.approveButton]}
          onPress={() => handleResolve(item._id, 'APPROVED')}
          disabled={resolvingId === item._id}
        >
          <Text style={styles.approveButtonText}>Approve</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.rejectButton]}
          onPress={() => handleResolve(item._id, 'REJECTED')}
          disabled={resolvingId === item._id}
        >
          <Text style={styles.rejectButtonText}>Reject</Text>
        </TouchableOpacity>
      </View>

      {resolvingId === item._id && (
        <ActivityIndicator size="small" color="#10b981" style={styles.loadingOverlay} />
      )}
    </View>
  );

  const pendingApprovals = approvals.filter(a => a.status === 'PENDING');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <ShieldCheck color="#10b981" size={24} style={styles.headerIcon} />
        <Text style={styles.headerTitle}>Approval Center</Text>
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
          data={pendingApprovals}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchApprovals(); }} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No pending approvals.</Text>
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
  listContainer: { padding: 16, gap: 16 },
  card: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e5e7eb', borderLeftWidth: 4, borderLeftColor: '#f59e0b', borderRadius: 12, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1, position: 'relative' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#111827', flex: 1, marginRight: 8 },
  riskBadge: { backgroundColor: '#fee2e2', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  riskBadgeText: { color: '#991b1b', fontSize: 10, fontWeight: '600' },
  description: { fontSize: 14, color: '#4b5563', marginBottom: 16 },
  actionRow: { flexDirection: 'row', gap: 12 },
  button: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8, justifyContent: 'center', alignItems: 'center', flex: 1 },
  approveButton: { backgroundColor: '#10b981' },
  approveButtonText: { color: '#ffffff', fontWeight: '600', fontSize: 14 },
  rejectButton: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#d1d5db' },
  rejectButtonText: { color: '#374151', fontWeight: '600', fontSize: 14 },
  loadingOverlay: { position: 'absolute', top: '50%', left: '50%', marginTop: -10, marginLeft: -10 },
  emptyContainer: { padding: 32, alignItems: 'center' },
  emptyText: { fontSize: 14, color: '#6b7280' },
});
