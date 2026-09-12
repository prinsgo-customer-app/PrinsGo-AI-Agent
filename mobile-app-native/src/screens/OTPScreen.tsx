import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { api } from '../api';
import { useAuthStore } from '../store/useAuthStore';
import { useRoute } from '@react-navigation/native';

export const OTPScreen = () => {
  const route = useRoute<any>();
  const phone = route.params?.phone || '';

  const [code, setCode] = useState('');
  const [name, setName] = useState(''); // Only needed if new user, but we show it to be safe
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();

  const handleVerifyOtp = async () => {
    if (!code || code.length < 4) {
      Alert.alert('Error', 'Please enter a valid OTP code');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/api/auth/verify-otp', {
        phone,
        code,
        name: name || 'PrinsGo User' // Fallback for new accounts if name not provided
      });

      if (res.data?.success && res.data?.token) {
        await login(res.data.user, res.data.token);
        // Navigation to App is handled automatically by RootNavigator based on auth state
      } else {
        Alert.alert('Error', res.data?.message || 'Verification failed');
      }
    } catch (error: any) {
      console.error('Verify OTP Error:', error?.response?.data || error);
      Alert.alert('Error', error?.response?.data?.message || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <View style={styles.content}>
          <Text style={styles.title}>Verify Account</Text>
          <Text style={styles.subtitle}>Enter the code sent to +91 {phone}</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="OTP Code"
              keyboardType="number-pad"
              maxLength={6}
              value={code}
              onChangeText={setCode}
              editable={!loading}
              textAlign="center"
            />
          </View>

          <Text style={styles.hint}>If you are a new user, please provide your name:</Text>
          <View style={[styles.inputContainer, { marginBottom: 32 }]}>
            <TextInput
              style={[styles.input, { textAlign: 'left' }]}
              placeholder="Full Name (Optional if existing)"
              value={name}
              onChangeText={setName}
              editable={!loading}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleVerifyOtp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Verify</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#10b981',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 32,
    textAlign: 'center',
  },
  hint: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
    textAlign: 'center',
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    backgroundColor: '#f9fafb',
    marginBottom: 16,
    justifyContent: 'center',
  },
  input: {
    fontSize: 18,
    color: '#1f2937',
    fontWeight: '600',
    letterSpacing: 2,
  },
  button: {
    backgroundColor: '#10b981',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#10b981',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
