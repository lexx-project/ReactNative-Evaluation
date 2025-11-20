import { CommonActions, createNavigationContainerRef } from '@react-navigation/native';
import { RootAuthStackParamList } from './types';

export const navigationRef =
  createNavigationContainerRef<RootAuthStackParamList>();

export function resetToLogin() {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      }),
    );
  }
}

export function navigateRoot<T extends keyof RootAuthStackParamList>(
  screen: T,
  params?: RootAuthStackParamList[T],
) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(screen, params);
  }
}
