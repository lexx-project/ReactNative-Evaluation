import { SafeAreaView, StyleSheet } from 'react-native';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { DrawerLockProvider } from './src/context/DrawerLockContext';
import { AuthProvider } from './src/context/AuthContext';

const App = () => {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <DrawerLockProvider>
          <SafeAreaView style={styles.container}>
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
          </SafeAreaView>
        </DrawerLockProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default App;
