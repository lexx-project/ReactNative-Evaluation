import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { useConnectivity } from '../context/ConnectivityContext';

export default function ConnectivityBanner() {
  const { isOffline } = useConnectivity();
  const translateY = useRef(new Animated.Value(-80)).current;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: isOffline ? 0 : -80,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [isOffline, translateY]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.container,
        {
          transform: [{ translateY }],
          opacity: isOffline ? 1 : 0,
        },
      ]}
    >
      <Text style={styles.text}>Koneksi terputus. Menggunakan mode offline.</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#d9534f',
    zIndex: 999,
  },
  text: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
});
