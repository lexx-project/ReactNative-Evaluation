import { SafeAreaView, StyleSheet } from 'react-native';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import DrawerNavigation from './src/navigation/DrawerNavigation';
import { DrawerLockProvider } from './src/context/DrawerLockContext';

const App = () => {
  return (
    <SafeAreaProvider>
      <DrawerLockProvider>
        <SafeAreaView style={styles.container}>
          <NavigationContainer>
            <DrawerNavigation />
          </NavigationContainer>
        </SafeAreaView>
      </DrawerLockProvider>
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
