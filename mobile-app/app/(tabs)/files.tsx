import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { File, UploadCloud, XCircle } from 'lucide-react-native';
import api from '../../src/lib/api';
import { useAuthStore } from '../../src/store/authStore';
import * as DocumentPicker from 'expo-document-picker';

type FileItem = {
  _id: string;
  name: string;
  size: number;
  mimeType: string;
  createdAt: string;
};

export default function FilesScreen() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const workspaceId = useAuthStore(state => state.workspaceId);

  const fetchFiles = useCallback(async () => {
    try {
      const res = await api.get(`/ai-agent/files?workspaceId=${workspaceId}`);
      setFiles(res.data.files || []);
      setErrorMsg('');
    } catch (error) {
      console.error(error);
      setErrorMsg('Files endpoint NOT_CONFIGURED or UNAVAILABLE.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleUploadClick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({});
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setErrorMsg('Files endpoint NOT_CONFIGURED. Cannot upload files at this time.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to select file.');
    }
  };

  const removeFile = async (id: string) => {
    try {
      await api.delete(`/ai-agent/files/${id}?workspaceId=${workspaceId}`);
      setFiles(prev => prev.filter(f => f._id !== id));
    } catch (e) {
      console.error(e);
      setErrorMsg('Failed to delete file.');
    }
  };

  const renderItem = ({ item }: { item: FileItem }) => (
    <View style={styles.card}>
      <View style={styles.fileInfo}>
        <View style={styles.iconWrapper}>
          <File color="#10b981" size={24} />
        </View>
        <View style={styles.details}>
          <Text style={styles.fileName}>{item.name}</Text>
          <Text style={styles.fileSize}>{(item.size / 1024).toFixed(2)} KB • {item.mimeType}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => removeFile(item._id)} style={styles.deleteButton}>
        <XCircle color="#ef4444" size={20} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <File color="#10b981" size={24} style={styles.headerIcon} />
        <Text style={styles.headerTitle}>Files & Attachments</Text>
      </View>

      {errorMsg ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      ) : null}

      <View style={styles.uploadArea}>
        <TouchableOpacity style={styles.uploadButton} onPress={handleUploadClick} disabled={loading}>
          <UploadCloud color="#ffffff" size={20} style={{ marginRight: 8 }} />
          <Text style={styles.uploadButtonText}>Upload New File</Text>
        </TouchableOpacity>
        <Text style={styles.uploadHint}>Supported formats: PDF, TXT, JSON, Images</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#10b981" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={files}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchFiles(); }} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No files uploaded yet.</Text>
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
  uploadArea: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6', backgroundColor: '#f9fafb', alignItems: 'center' },
  uploadButton: { flexDirection: 'row', backgroundColor: '#10b981', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8, alignItems: 'center', justifyContent: 'center', width: '100%' },
  uploadButtonText: { color: '#ffffff', fontWeight: 'bold', fontSize: 16 },
  uploadHint: { marginTop: 8, fontSize: 12, color: '#6b7280' },
  listContainer: { padding: 16, gap: 12 },
  card: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  fileInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconWrapper: { width: 40, height: 40, borderRadius: 8, backgroundColor: '#d1fae5', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  details: { flex: 1 },
  fileName: { fontSize: 14, fontWeight: '600', color: '#111827', marginBottom: 4 },
  fileSize: { fontSize: 12, color: '#6b7280' },
  deleteButton: { padding: 8 },
  emptyContainer: { padding: 32, alignItems: 'center' },
  emptyText: { fontSize: 14, color: '#6b7280' },
});
