// src/navigation/AppDrawer.tsx

import { createDrawerNavigator } from '@react-navigation/drawer';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import MainStack from './MainStack';
import CustomDrawer from './CustomDrawer';
import { View, Text } from 'react-native';

import { GestureHandlerRootView } from 'react-native-gesture-handler';

const SettingsScreen = () => (
  <View>
    <Text>Settings Screen</Text>
  </View>
);
const HistoryScreen = () => (
  <View>
    <Text>History Screen</Text>
  </View>
);

const Drawer = createDrawerNavigator();

export default function AppDrawer() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer.Navigator
        screenOptions={{
          headerShown: false,
        }}
        drawerContent={props => <CustomDrawer {...props} />}
      >
        <Drawer.Screen
          name="Beranda"
          component={MainStack}
          options={({ route }) => {
            const routeName = getFocusedRouteNameFromRoute(route);
            let lockMode: 'locked-closed' | 'unlocked' = 'unlocked';
            if (routeName === 'ProductDetail' || routeName === 'Checkout') {
              lockMode = 'locked-closed';
            }
            return { swipeEnabled: lockMode === 'unlocked' };
          }}
        />
        <Drawer.Screen name="Pengaturan" component={SettingsScreen} />
        <Drawer.Screen name="Riwayat" component={HistoryScreen} />
      </Drawer.Navigator>
    </GestureHandlerRootView>
  );
}
