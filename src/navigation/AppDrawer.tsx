// src/navigation/AppDrawer.tsx

import { createDrawerNavigator } from '@react-navigation/drawer';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import MainStack from './MainStack';
import CustomDrawer from './CustomDrawer';
import AboutScreen from '../screens/AboutScreen';
import ProductListScreen from '../screens/ProductListScreen';

import { GestureHandlerRootView } from 'react-native-gesture-handler';

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
        <Drawer.Screen name="Products" component={ProductListScreen} />
        <Drawer.Screen name="About" component={AboutScreen} />
      </Drawer.Navigator>
    </GestureHandlerRootView>
  );
}
