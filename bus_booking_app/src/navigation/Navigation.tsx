import { View, Text } from 'react-native'
import React from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';

const Stack =createNativeStackNavigator();
const Navigation = () => {
  return (
    <NavigationContainer>
        <Stack.Navigator initialRouteName='SplashScreen'
        screenOptions={{
            headerShown:false,
        }}>
            <Stack.Screen name='SplashScreen'component={SplashScreen}/>
            <Stack.Screen name='LoginScreen' component={LoginScreen}/>
        </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Navigation;