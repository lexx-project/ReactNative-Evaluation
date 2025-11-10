import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DrawerNavigation from './DrawerNavigation';
const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{ animation: 'fade_from_bottom', headerShown: false }}
    >
      <Stack.Screen name="drawer" component={DrawerNavigation} />
    </Stack.Navigator>
  );
}
