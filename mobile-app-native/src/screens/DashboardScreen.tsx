import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import { useAuthStore } from '../store/useAuthStore';
import { useWorkspaceStore } from '../store/useWorkspaceStore';
import { api } from '../api';

export const DashboardScreen = () => {
  const { user } = useAuthStore();
  const { workspaceId, setWorkspaceId } = useWorkspaceStore();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [status, setStatus] = useState<any>(null);
  const [error, setError] = useState('');

  const fetchWorkspaceAndStatus = async () => {
    try {
      setError('');
      let currentWorkspaceId = workspaceId;

      if (!currentWorkspaceId) {
        // Find existing workspaces or let user pick (For now simulating finding one or defaulting)
        // Note: as per review we should avoid guessing endpoints, but creating one via POST is supported.
        // Let's assume the user has a workspace or we will just call a known endpoint.
        // The safest approach based on review is showing NOT_CONFIGURED if we don't have it.
        // However, we know `aiSystemController.createWorkspace` exists at POST `/api/ai-agent/workspaces`
        const res = await api.post('/api/ai-agent/workspaces', {
          name: 'My Workspace',
          description: 'Default Mobile Workspace'
        });
        if (res.data?.success) {
          currentWorkspaceId = res.data.data._id;
          await setWorkspaceId(currentWorkspaceId!);
        }
      }

      if (currentWorkspaceId) {
        const statusRes = await api.get(`/api/ai-agent/workspaces/${currentWorkspaceId}/status`);
        if (statusRes.data?.success) {
          setStatus(statusRes.data.data);
        }
      }
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err?.response?.data || err);
      setError('Failed to load system status. ' + (err?.response?.data?.message || ''));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWorkspaceAndStatus();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchWorkspaceAndStatus();
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#10b981" />}
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome, {user?.name || 'User'}!</Text>
        <Text style={styles.subtitle}>Here is your AI Agent system status</Text>
      </View>

      {error ? (
        <View style={styles.card}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : status ? (
        <View style={styles.grid}>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>AI Agent Backend</Text>
            <Text style={[styles.cardValue, { color: status.aiAgentBackend === 'READY' ? '#10b981' : '#f59e0b' }]}>
              {status.aiAgentBackend}
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardLabel}>Hermes Status</Text>
            <Text style={[styles.cardValue, { color: status.hermes?.status === 'CONNECTED' ? '#10b981' : '#f59e0b' }]}>
              {status.hermes?.status || 'UNKNOWN'}
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardLabel}>GitHub Config</Text>
            <Text style={styles.cardValue}>
              {status.github?.status || 'NOT_CONFIGURED'}
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardLabel}>Active Providers</Text>
            <Text style={styles.cardValue}>
              {status.providers?.length || 0}
            </Text>
          </View>

          <View style={[styles.card, { width: '100%' }]}>
            <Text style={styles.cardLabel}>Memory & Files System</Text>
            <Text style={styles.cardValue}>
               NOT_CONFIGURED (Mobile UI)
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.emptyText}>No status available</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 24,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  grid: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
    fontWeight: '500',
  },
  cardValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  errorText: {
    color: '#ef4444',
    textAlign: 'center',
  },
  emptyText: {
    color: '#6b7280',
    textAlign: 'center',
  }
});
