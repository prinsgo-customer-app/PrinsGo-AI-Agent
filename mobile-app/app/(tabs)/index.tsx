import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Zap, CheckCircle2, Clock, Activity, Send } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import api from '../../src/lib/api';
import { useAuthStore } from '../../src/store/authStore';

export default function DashboardScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({ activeTasks: 0, completed: 0, pendingApprovals: 0, health: 'UNAVAILABLE' });
  const [errorMsg, setErrorMsg] = useState('');

  const router = useRouter();
  const workspaceId = useAuthStore(state => state.workspaceId);

  const fetchDashboardData = async () => {
    try {
      const [tasksRes, approvalsRes, hermesRes] = await Promise.all([
        api.get(`/ai-agent/tasks?workspaceId=${workspaceId}`),
        api.get(`/ai-agent/admin/approvals?workspaceId=${workspaceId}`),
        api.get(`/ai-agent/admin/hermes/status`)
      ]);

      const tasks = tasksRes.data?.tasks || [];
      const approvals = approvalsRes.data?.approvals || [];

      setMetrics({
        activeTasks: tasks.filter((t: any) => t.status === 'RUNNING').length || 0,
        completed: tasks.filter((t: any) => t.status === 'COMPLETED').length || 0,
        pendingApprovals: approvals.filter((a: any) => a.status === 'PENDING').length || 0,
        health: hermesRes.data?.status
      });
      setErrorMsg('');
    } catch (error: any) {
      console.error("Dashboard data fetch error:", error);
      setErrorMsg('Failed to load dashboard data. Pull to refresh.');
      setMetrics({ activeTasks: 0, completed: 0, pendingApprovals: 0, health: 'ERROR' });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [workspaceId]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>Welcome to PrinsGo</Text>
          <Text style={styles.subtitle}>Your Digital Workforce is ready</Text>
        </View>

        {errorMsg ? (
           <View style={styles.errorBox}>
             <Text style={styles.errorText}>{errorMsg}</Text>
           </View>
        ) : null}

        <TouchableOpacity style={styles.askAiCard} onPress={() => router.push('/chat')}>
          <View style={styles.askAiContent}>
            <Text style={styles.askAiTitle}>Ask AI...</Text>
            <Text style={styles.askAiSub}>Create tasks, analyze data</Text>
          </View>
          <View style={styles.askAiIcon}>
            <Send color="#ffffff" size={20} />
          </View>
        </TouchableOpacity>

        <View style={styles.grid}>
          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>Active Tasks</Text>
              <View style={[styles.iconWrapper, { backgroundColor: '#d1fae5' }]}>
                <Zap color="#059669" size={16} />
              </View>
            </View>
            <Text style={styles.metricValue}>{metrics.activeTasks}</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>Completed</Text>
              <View style={[styles.iconWrapper, { backgroundColor: '#dbeafe' }]}>
                <CheckCircle2 color="#2563eb" size={16} />
              </View>
            </View>
            <Text style={styles.metricValue}>{metrics.completed}</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>Approvals</Text>
              <View style={[styles.iconWrapper, { backgroundColor: '#fef3c7' }]}>
                <Clock color="#d97706" size={16} />
              </View>
            </View>
            <Text style={styles.metricValue}>{metrics.pendingApprovals}</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>Hermes Status</Text>
              <View style={[styles.iconWrapper, { backgroundColor: '#f3f4f6' }]}>
                <Activity color="#4b5563" size={16} />
              </View>
            </View>
            <Text style={[styles.metricValue, { fontSize: 16, marginTop: 12 }]}>{metrics.health || 'ERROR'}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  centered: { justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 16, paddingBottom: 40 },
  header: { marginBottom: 24 },
  greeting: { fontSize: 28, fontWeight: 'bold', color: '#111827' },
  subtitle: { fontSize: 16, color: '#6b7280', marginTop: 4 },
  errorBox: { padding: 12, backgroundColor: '#fef2f2', borderRadius: 8, marginBottom: 16 },
  errorText: { color: '#ef4444', fontSize: 14 },
  askAiCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 16, padding: 16, marginBottom: 24 },
  askAiContent: { flex: 1 },
  askAiTitle: { fontSize: 18, fontWeight: '600', color: '#374151' },
  askAiSub: { fontSize: 14, color: '#9ca3af', marginTop: 2 },
  askAiIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#10b981', justifyContent: 'center', alignItems: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  metricCard: { width: '47%', backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#f3f4f6', borderRadius: 12, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  metricHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  metricLabel: { fontSize: 14, color: '#6b7280', flex: 1 },
  iconWrapper: { width: 28, height: 28, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  metricValue: { fontSize: 28, fontWeight: 'bold', color: '#111827', marginTop: 8 },
});
