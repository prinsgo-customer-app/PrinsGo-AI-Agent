import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FolderGit2 } from 'lucide-react-native';
import api from '../../src/lib/api';
import { useAuthStore } from '../../src/store/authStore';

type Repo = {
  _id: string;
  name: string;
  owner: string;
  branch: string;
  status: string;
};

export default function GithubScreen() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const workspaceId = useAuthStore(state => state.workspaceId);

  const fetchRepos = useCallback(async () => {
    try {
      const res = await api.get(`/ai-agent/admin/repositories?workspaceId=${workspaceId}`);
      setRepos(res.data.repositories || []);
      setErrorMsg('');
    } catch (error) {
      console.error(error);
      setErrorMsg('GitHub connection NOT_CONFIGURED or UNAVAILABLE.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    fetchRepos();
  }, [fetchRepos]);

  const handleAnalyze = async (repoId: string) => {
    setSuccessMsg('');
    setErrorMsg('');
    try {
      await api.post(`/ai-agent/tasks`, {
        workspaceId,
        action: 'ANALYZE_REPO',
        repoId
      });
      setSuccessMsg(`Analyze request sent for repository ${repoId}. Check tasks for status.`);
    } catch (error) {
      console.error(error);
      setErrorMsg('Failed to send analyze request. UNAVAILABLE.');
    }
  };

  const renderItem = ({ item }: { item: Repo }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <FolderGit2 color="#10b981" size={20} />
        <Text style={styles.repoName}>{item.name}</Text>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.detailText}>Owner: {item.owner}</Text>
        <Text style={styles.detailText}>Branch: {item.branch}</Text>
        <Text style={styles.statusText}>{item.status}</Text>
      </View>
      <TouchableOpacity style={styles.actionButton} onPress={() => handleAnalyze(item._id)}>
        <Text style={styles.actionButtonText}>Analyze Code</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <FolderGit2 color="#111827" size={24} style={styles.headerIcon} />
        <Text style={styles.headerTitle}>GitHub Repositories</Text>
      </View>

      {errorMsg ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      ) : null}
      {successMsg ? (
        <View style={styles.successBox}>
          <Text style={styles.successText}>{successMsg}</Text>
        </View>
      ) : null}

      {loading ? (
        <ActivityIndicator size="large" color="#10b981" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={repos}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchRepos(); }} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No repositories connected. NOT_CONFIGURED.</Text>
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
  successBox: { margin: 16, padding: 12, backgroundColor: '#d1fae5', borderRadius: 8 },
  successText: { color: '#059669', fontSize: 14 },
  listContainer: { padding: 16, gap: 16 },
  card: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  repoName: { fontSize: 16, fontWeight: '600', color: '#111827', marginLeft: 8 },
  cardBody: { marginBottom: 16, gap: 4 },
  detailText: { fontSize: 14, color: '#4b5563' },
  statusText: { fontSize: 12, fontWeight: 'bold', color: '#059669', marginTop: 4 },
  actionButton: { backgroundColor: '#f3f4f6', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  actionButtonText: { color: '#374151', fontWeight: '600', fontSize: 14 },
  emptyContainer: { padding: 32, alignItems: 'center' },
  emptyText: { fontSize: 14, color: '#6b7280' },
});
