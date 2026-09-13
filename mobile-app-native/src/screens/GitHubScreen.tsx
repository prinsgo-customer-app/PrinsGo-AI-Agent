import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, RefreshControl, ScrollView } from 'react-native';
import { api } from '../api';
import { useWorkspaceStore } from '../store/useWorkspaceStore';

export const GitHubScreen = () => {
  const { workspaceId } = useWorkspaceStore();
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchStatus = async () => {
    if (!workspaceId) {
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      setError('');
      const res = await api.get(`/api/ai-agent/workspaces/${workspaceId}/github/status`);
      if (res.data?.success) {
        setStatus(res.data.data);
      } else {
        setError('Failed to fetch GitHub status');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'GitHub not configured or unavailable');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [workspaceId]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchStatus();
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.content}>
        {loading ? (
          <View style={styles.center}><ActivityIndicator size="large" color="#10b981" /></View>
        ) : error ? (
          <View style={styles.card}>
            <Text style={styles.error}>{error}</Text>
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.title}>GitHub Integration Status</Text>
            <Text style={styles.value}>Status: {status?.status || 'UNKNOWN'}</Text>
            {status?.message && <Text style={styles.subtitle}>{status.message}</Text>}
            <Text style={styles.info}>Note: GitHub configuration must be done securely via the web interface to protect server secrets.</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  content: { padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  card: { backgroundColor: '#fff', padding: 24, borderRadius: 12, elevation: 2 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 12 },
  value: { fontSize: 16, color: '#10b981', fontWeight: '600', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#6b7280', marginBottom: 16 },
  info: { fontSize: 12, color: '#9ca3af', marginTop: 16, fontStyle: 'italic' },
  error: { color: '#ef4444', fontSize: 16, textAlign: 'center' }
});