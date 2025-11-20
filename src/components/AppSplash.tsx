import React from 'react';
import { ActivityIndicator, StyleSheet, View, Image, Text } from 'react-native';

export default function AppSplash() {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://upload.lexxganz.my.id/uploads/cart%20(1).png' }}
        style={styles.logo}
      />
      <Text style={styles.title}>Lexx Store</Text>
      <ActivityIndicator size="large" color="#1e90ff" />
      <Text style={styles.subtitle}>Wettt</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f172a',
    gap: 12,
  },
  logo: {
    width: 72,
    height: 72,
    tintColor: '#38bdf8',
  },
  title: {
    color: '#e2e8f0',
    fontSize: 20,
    fontWeight: '700',
  },
  subtitle: {
    color: '#94a3b8',
  },
});
