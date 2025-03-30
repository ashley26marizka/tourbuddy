import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './index';  // Ensure correct path
import PlanScreen from './plan'; 
import LoginScreen from './login';
import SignUpScreen from './signup';
import TripScreen from './trip';
import NewPage from './newpage';
import './firebaseconfig';
       // Ensure correct path

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Plan" component={PlanScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stact.Screen name="Trip" component={TripScreen} />
        <Stack.Screen name="new" component={NewPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}