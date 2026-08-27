import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import DashboardScreen from './screens/DashboardScreen';
import InspectionScreen from './screens/InspectionScreen';
import AttendanceScreen from './screens/AttendanceScreen';
import InventoryScreen from './screens/InventoryScreen';
import LoginScreen from './screens/LoginScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const DashboardStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="DashboardMain"
      component={DashboardScreen}
      options={{ title: 'Dashboard' }}
    />
  </Stack.Navigator>
);

const InspectionStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="InspectionMain"
      component={InspectionScreen}
      options={{ title: 'Inspection' }}
    />
  </Stack.Navigator>
);

const AttendanceStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="AttendanceMain"
      component={AttendanceScreen}
      options={{ title: 'Attendance' }}
    />
  </Stack.Navigator>
);

const InventoryStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="InventoryMain"
      component={InventoryScreen}
      options={{ title: 'Inventory' }}
    />
  </Stack.Navigator>
);

const RootNavigator = ({ isSignedIn }: { isSignedIn: boolean }) => {
  return (
    <NavigationContainer>
      {!isSignedIn ? (
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      ) : (
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarLabel: route.name === 'Dashboard' ? '🏠' : route.name === 'Inspection' ? '🔍' : route.name === 'Attendance' ? '✓' : '📦',
            headerShown: false,
          })}
        >
          <Tab.Screen name="Dashboard" component={DashboardStack} />
          <Tab.Screen name="Inspection" component={InspectionStack} />
          <Tab.Screen name="Attendance" component={AttendanceStack} />
          <Tab.Screen name="Inventory" component={InventoryStack} />
        </Tab.Navigator>
      )}
    </NavigationContainer>
  );
};

export default RootNavigator;
