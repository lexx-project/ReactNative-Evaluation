import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawer from '../components/CustomDrawer';
import MainStack from './MainStack';
import AboutScreen from '../screens/AboutScreen';
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
        name="Home"
        component={MainStack}
        options={{ title: 'Home' }}
      />
      <Drawer.Screen
        name="About"
        component={AboutScreen}
        options={{ title: 'About' }}
      />
    </Drawer.Navigator>
  );
}
