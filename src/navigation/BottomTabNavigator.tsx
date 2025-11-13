import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import AboutScreen from '../screens/AboutScreen';
import ProductListScreen from '../screens/ProductListScreen';

export type BottomTabsParamList = {
  Home: undefined;
  Products: undefined;
  About: undefined;
};

const Tab = createBottomTabNavigator<BottomTabsParamList>();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ animation: 'fade', headerShown: false }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="home" color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Products"
        component={ProductListScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name="th-list" size={26} color={color} />
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
    </Tab.Navigator>
  );
}
