import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import { api } from '../api';
import { useWorkspaceStore } from '../store/useWorkspaceStore';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export const AgentsScreen = () => {
  const { workspaceId } = useWorkspaceStore();
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const fetchAgents = async () => {
    if (!workspaceId) {
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      const res = await api.get(`/api/ai-agent/workspaces/${workspaceId}/agents`);
      if (res.data?.success) {
        setAgents(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching agents:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, [workspaceId]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAgents();
  };

  const renderAgent = ({ item }: { item: any }) => (
    <TouchableOpacity
       style={styles.card}
       onPress={() => navigation.navigate('Chat', { agentId: item._id, agentName: item.name })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.agentName}>{item.name}</Text>
        <View style={[styles.statusBadge, { backgroundColor: item.isEnabled ? '#d1fae5' : '#f3f4f6' }]}>
          <Text style={[styles.statusText, { color: item.isEnabled ? '#059669' : '#6b7280' }]}>
            {item.isEnabled ? 'Active' : 'Inactive'}
          </Text>
        </View>
      </View>
      <Text style={styles.agentDescription}>{item.description}</Text>
      <Text style={styles.providerInfo}>Provider: {item.provider} ({item.model})</Text>
      <Text style={styles.chatPrompt}>Tap to chat ➔</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#10b981" />
        </View>
      ) : (
        <FlatList
          data={agents}
          keyExtractor={(item) => item._id}
          renderItem={renderAgent}
          contentContainerStyle={styles.listContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#10b981" />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No AI Agents configured yet.</Text>
            </View>
          }
        />
      )}
    </View>
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
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  agentName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  agentDescription: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 12,
  },
  providerInfo: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
    marginBottom: 8,
  },
  chatPrompt: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: '600',
    textAlign: 'right'
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    color: '#6b7280',
    fontSize: 16,
  }
});
