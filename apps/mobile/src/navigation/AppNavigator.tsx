import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootStackParamList, AuthStackParamList, MainTabParamList } from './types';
import { useAuth } from '../hooks/useAuth';

import { Icon } from '../components/Icon';

// Screens (we will create/move these later)
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import HomeScreen from '../screens/tabs/HomeScreen';
import CreateRideScreen from '../screens/tabs/CreateRideScreen';
import MyRidesScreen from '../screens/tabs/MyRidesScreen';
import ProfileScreen from '../screens/tabs/ProfileScreen';
import RideDetailsScreen from '../screens/RideDetailsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = '';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'CreateRide') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'MyRides') {
            iconName = focused ? 'car' : 'car-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="CreateRide" component={CreateRideScreen} options={{ title: 'Publish' }} />
      <Tab.Screen name="MyRides" component={MyRidesScreen} options={{ title: 'My Rides' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

import { navigationRef } from './NavigationService';

export default function AppNavigator() {
  const { isAuthenticated } = useAuth();

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          <Stack.Screen name="Main" component={MainNavigator} />
        )}
        <Stack.Screen
          name="RideDetails"
          component={RideDetailsScreen}
          options={{ headerShown: true, title: 'Ride Details', presentation: 'modal' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
