import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { CommonActions, useNavigation, useFocusEffect } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';

import { RootAuthStackParamList } from '../navigation/types';
import { enforceExpiry } from '../utils/storage';
import { PendingLink, useAuth } from '../context/AuthContext';

type ProtectedRouteProps = {
  children: React.ReactNode;
  onBlock?: () => void;
  targetLink?: PendingLink;
};

export default function ProtectedRoute({
  children,
  onBlock,
  targetLink,
}: ProtectedRouteProps) {
  const navigation = useNavigation<NavigationProp<RootAuthStackParamList>>();
  const { setPendingLink } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  const redirectToLogin = useCallback(() => {
    onBlock?.();
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      }),
    );
  }, [navigation, onBlock]);

  const verifySession = useCallback(async () => {
    setIsChecking(true);
    try {
      const state = await enforceExpiry();
      if (state !== 'valid') {
        if (targetLink) {
          setPendingLink(targetLink);
        }
        redirectToLogin();
        return;
      }
    } finally {
      setIsChecking(false);
    }
  }, [redirectToLogin, setPendingLink]);

  useEffect(() => {
    verifySession();
  }, [verifySession]);

  useFocusEffect(
    useCallback(() => {
      verifySession();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  if (isChecking) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fff',
        }}
      >
        <ActivityIndicator size="large" color="#1e90ff" />
      </View>
    );
  }

  return <>{children}</>;
}
