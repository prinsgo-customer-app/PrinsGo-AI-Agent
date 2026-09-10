import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ShieldAlert, Activity } from 'lucide-react-native';
import api from '../../src/lib/api';
import { useAuthStore } from '../../src/store/authStore';

export default function AdminScreen() {
  const [logs, setLogs] = useState<any[]>([]);
  const [hermesStatus, setHermesStatus] = useState({ status: 'LOADING', message: '' });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const workspaceId = useAuthStore(state => state.workspaceId);

  const fetchAdminData = useCallback(async () => {
    try {
      const [logsRes, hermesRes] = await Promise.all([
        api.get(`/ai-agent/admin/logs?workspaceId=${workspaceId}`),
        api.get(`/ai-agent/admin/hermes/status`)
      ]);
      setLogs(logsRes.data.logs || []);
      setHermesStatus(hermesRes.data);
    } catch (error) {
      console.error("Admin fetch error:", error);
      setHermesStatus({ status: 'ERROR', message: 'Could not fetch status' });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  const renderLog = ({ item }: { item: any }) => (
    <View style={styles.logCard}>
      <View style={styles.logHeader}>
        <Text style={styles.logAction}>{item.action}</Text>
        <Text style={styles.logDate}>{new Date(item.createdAt).toLocaleString()}</Text>
      </View>
      <Text style={styles.logDetails}>Tool: {item.tool}</Text>
      <Text style={styles.logDetails}>Result: {item.result || item.error || 'N/A'}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <ShieldAlert color="#10b981" size={24} style={styles.headerIcon} />
        <Text style={styles.headerTitle}>Admin Control</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#10b981" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={logs}
          keyExtractor={(item: any) => item._id || Math.random().toString()}
          renderItem={renderLog}
          contentContainerStyle={styles.listContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchAdminData(); }} />}
          ListHeaderComponent={
            <View style={styles.statusCard}>
              <View style={styles.statusHeader}>
                <Activity color="#4b5563" size={20} />
                <Text style={styles.statusTitle}>Hermes Integration</Text>
              </View>
              <View style={styles.statusContent}>
                <View style={[
                  styles.statusBadge,
                  hermesStatus?.status?.toUpperCase() === 'CONNECTED' ? styles.statusBadgeSuccess :
                  hermesStatus?.status?.toUpperCase() === 'DISABLED' ? styles.statusBadgeNeutral :
                  styles.statusBadgeError
                ]}>
                  <Text style={[
                    styles.statusBadgeText,
                    hermesStatus?.status?.toUpperCase() === 'CONNECTED' ? styles.statusBadgeTextSuccess :
                    hermesStatus?.status?.toUpperCase() === 'DISABLED' ? styles.statusBadgeTextNeutral :
                    styles.statusBadgeTextError
                  ]}>
                    {hermesStatus?.status?.toUpperCase() || 'ERROR'}
                  </Text>
                </View>
                {hermesStatus.message ? <Text style={styles.statusMessage}>{hermesStatus.message}</Text> : null}
              </View>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No audit logs found.</Text>
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
  listContainer: { padding: 16, gap: 12 },
  statusCard: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 16, marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  statusHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  statusTitle: { fontSize: 16, fontWeight: '600', color: '#111827', marginLeft: 8 },
  statusContent: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  statusBadgeSuccess: { backgroundColor: '#d1fae5' },
  statusBadgeNeutral: { backgroundColor: '#f3f4f6' },
  statusBadgeError: { backgroundColor: '#fee2e2' },
  statusBadgeText: { fontSize: 12, fontWeight: 'bold' },
  statusBadgeTextSuccess: { color: '#059669' },
  statusBadgeTextNeutral: { color: '#4b5563' },
  statusBadgeTextError: { color: '#dc2626' },
  statusMessage: { flex: 1, fontSize: 14, color: '#6b7280' },
  logCard: { backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#f3f4f6', paddingVertical: 12 },
  logHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  logAction: { fontSize: 14, fontWeight: '600', color: '#111827' },
  logDate: { fontSize: 12, color: '#9ca3af' },
  logDetails: { fontSize: 12, color: '#4b5563', marginTop: 2 },
  emptyContainer: { padding: 32, alignItems: 'center' },
  emptyText: { fontSize: 14, color: '#6b7280' },
});
