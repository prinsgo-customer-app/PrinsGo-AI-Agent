import { View, ActivityIndicator, StyleSheet } from 'react-native';

export default function IndexScreen() {
  // Let the _layout.tsx handle the actual redirection based on authentication state
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#10b981" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff'
  }
});
