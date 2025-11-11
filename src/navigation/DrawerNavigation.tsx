import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawer from '../components/CustomDrawer';
import BottomTabNavigator from './BottomTabNavigator';
import { useDrawerLock } from '../context/DrawerLockContext';
const Drawer = createDrawerNavigator();

export default function DrawerNavigation() {
  const { isSwipeEnabled } = useDrawerLock();

  return (
    <Drawer.Navigator
      screenOptions={{ headerShown: false, swipeEnabled: isSwipeEnabled }}
      drawerContent={props => <CustomDrawer {...props} />}
    >
      <Drawer.Screen
        name="MainTabs"
        component={BottomTabNavigator}
        options={{ title: 'Home' }}
      />
    </Drawer.Navigator>
  );
}
