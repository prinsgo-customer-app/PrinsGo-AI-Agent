import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { api } from '../api';
import { useWorkspaceStore } from '../store/useWorkspaceStore';

export const ProvidersScreen = () => {
  const { workspaceId } = useWorkspaceStore();
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchProviders = async () => {
    if (!workspaceId) {
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      setError('');
      const res = await api.get(`/api/ai-agent/workspaces/${workspaceId}/providers`);
      if (res.data?.success) {
        setProviders(res.data.data);
      } else {
        setError('Failed to fetch providers');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Providers not configured or unavailable');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, [workspaceId]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProviders();
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.providerType}</Text>
      <Text style={[styles.subtitle, { color: item.status === 'CONNECTED' ? '#10b981' : '#f59e0b' }]}>
        Status: {item.status}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.center}><ActivityIndicator size="large" color="#10b981" /></View>
      ) : error ? (
        <View style={styles.center}><Text style={styles.error}>{error}</Text></View>
      ) : (
        <>
          <Text style={styles.headerInfo}>Note: Provider API keys are managed securely on the backend server.</Text>
          <FlatList
            data={providers}
            keyExtractor={(item, index) => item._id || index.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            ListEmptyComponent={
              <View style={styles.center}>
                 <Text style={styles.emptyText}>No AI Providers configured.</Text>
              </View>
            }
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  headerInfo: { padding: 16, paddingBottom: 0, fontSize: 12, color: '#9ca3af', fontStyle: 'italic', textAlign: 'center' },
  list: { padding: 16 },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, elevation: 2 },
  title: { fontSize: 16, fontWeight: 'bold', color: '#111827', textTransform: 'capitalize' },
  subtitle: { fontSize: 14, marginTop: 4, fontWeight: '500' },
  emptyText: { color: '#6b7280', fontSize: 16, textAlign: 'center' },
  error: { color: '#ef4444', fontSize: 16, textAlign: 'center' }
});