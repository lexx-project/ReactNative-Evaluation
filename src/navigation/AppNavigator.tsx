import AboutScreen from '../screens/AboutScreen';
import HomeScreen from '../screens/HomeScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ animation: 'fade_from_bottom' }}>
      <Stack.Screen
        name="home"
        component={HomeScreen}
        options={{ headerTitle: 'Dashboard' }}
      />
      <Stack.Screen name="about" component={AboutScreen} />
    </Stack.Navigator>
  );
}
