import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import AboutScreen from '../screens/AboutScreen';
import MainStack from './MainStack';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ animation: 'fade', headerShown: false }}>
      <Tab.Screen
        name="HomeStack"
        component={MainStack}
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="home" color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="About"
        component={AboutScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name="user" size={28} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name="id-badge" size={26} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
