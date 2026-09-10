import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, LogOut, Shield, Bell, HelpCircle, FileText, Globe, Moon } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../src/store/authStore';
import { useSettingsStore } from '../../src/store/settingsStore';

export default function SettingsScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { notificationsEnabled, darkMode, setNotifications, setDarkMode } = useSettingsStore();

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  const OptionItem = ({ icon, title, value, type = 'navigate' }: any) => (
    <TouchableOpacity style={styles.optionItem} disabled={type !== 'navigate'}>
      <View style={styles.optionLeft}>
        <View style={styles.optionIcon}>{icon}</View>
        <Text style={styles.optionTitle}>{title}</Text>
      </View>
      {type === 'switch' && (
        <Switch
          value={value}
          onValueChange={title === 'Notifications' ? setNotifications : setDarkMode}
          trackColor={{ false: '#d1d5db', true: '#10b981' }}
          thumbColor="#ffffff"
        />
      )}
      {type === 'navigate' && <Text style={styles.optionValue}>{value}</Text>}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <User color="#10b981" size={40} />
          </View>
          <Text style={styles.profileName}>{user?.name ? String(user.name) : 'User'}</Text>
          <Text style={styles.profileEmail}>{user?.email ? String(user.email) : ''}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{user?.role ? String(user.role) : 'Workspace Member'}</Text>
          </View>
        </View>

        <View style={styles.group}>
          <Text style={styles.groupTitle}>Preferences</Text>
          <View style={styles.groupContent}>
            <OptionItem
              icon={<Bell color="#4b5563" size={20} />}
              title="Notifications"
              type="switch"
              value={notificationsEnabled}
            />
            <OptionItem
              icon={<Moon color="#4b5563" size={20} />}
              title="Dark Mode"
              type="switch"
              value={darkMode}
            />
            <OptionItem
              icon={<Globe color="#4b5563" size={20} />}
              title="Language"
              value="English"
            />
          </View>
        </View>

        <View style={styles.group}>
          <Text style={styles.groupTitle}>Account & Security</Text>
          <View style={styles.groupContent}>
            <OptionItem
              icon={<Shield color="#4b5563" size={20} />}
              title="Privacy & Security"
            />
            <OptionItem
              icon={<FileText color="#4b5563" size={20} />}
              title="Terms of Service"
            />
            <OptionItem
              icon={<HelpCircle color="#4b5563" size={20} />}
              title="Help & Support"
            />
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut color="#ef4444" size={20} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  scrollContent: { padding: 16, paddingBottom: 40 },
  profileSection: { alignItems: 'center', marginBottom: 32, marginTop: 16 },
  avatarContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#d1fae5', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  profileName: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 4 },
  profileEmail: { fontSize: 14, color: '#6b7280', marginBottom: 12 },
  roleBadge: { backgroundColor: '#10b981', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 16 },
  roleText: { color: '#ffffff', fontSize: 12, fontWeight: '600' },
  group: { marginBottom: 24 },
  groupTitle: { fontSize: 14, fontWeight: '600', color: '#6b7280', marginBottom: 8, marginLeft: 8, textTransform: 'uppercase' },
  groupContent: { backgroundColor: '#ffffff', borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#e5e7eb' },
  optionItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  optionLeft: { flexDirection: 'row', alignItems: 'center' },
  optionIcon: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#f3f4f6', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  optionTitle: { fontSize: 16, color: '#374151' },
  optionValue: { fontSize: 14, color: '#9ca3af' },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fef2f2', padding: 16, borderRadius: 12, marginTop: 8, borderWidth: 1, borderColor: '#fecaca' },
  logoutText: { color: '#ef4444', fontSize: 16, fontWeight: '600', marginLeft: 8 },
});
