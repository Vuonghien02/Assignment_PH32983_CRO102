import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import WelcomeScreen from './screens/WelcomeScreen';
import OnboardingScreen1 from './screens/OnboardingScreen1';
import OnboardingScreen2 from './screens/OnboardingScreen2';
import LoginScreen from './screens/LoginScreen';
import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';
import HomeScreen from './screens/HomeScreen';
import Toast from 'react-native-toast-message';
import TinhThanScreen from './screens/TinhThanScreen';
import TheChatScreen from './screens/TheChatScreen';
import NguNghiScreen from './screens/NguNghiScreen';
import VideoYoga from './screens/VideoYoga';
import AnUongScreen from './screens/AnUongScreen';
import UserScreen from './screens/UserScreen';
import { ThemeProvider } from './screens/ThemeContext'; // Import ThemeProvider
import TuVanScreen from './screens/TuVanScreen';
import ChatScreen from './screens/ChatScreen';
import BacSiChat from './screens/BacSiChat';



const Stack = createStackNavigator();

const App = () => {
  return (
    <ThemeProvider>

      <NavigationContainer>
        <Stack.Navigator initialRouteName='Welcome'>
          <Stack.Screen
            name='Welcome'
            component={WelcomeScreen}
            options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid }}
          />
          <Stack.Screen
            name='Onboarding1'
            component={OnboardingScreen1}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='Onboarding2'
            component={OnboardingScreen2}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='Login'
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='SingIn'
            component={SignInScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='SingUp'
            component={SignUpScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='Home'
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='TinhThan'
            component={TinhThanScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='TheChat'
            component={TheChatScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='NguNghi'
            component={NguNghiScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='VideoYoga'
            component={VideoYoga}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='AnUong'
            component={AnUongScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='User'
            component={UserScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='TuVan'
            component={TuVanScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='Chat'
            component={ChatScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='BacSiChat'
            component={BacSiChat}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>

  );
}

export default App;

const styles = StyleSheet.create({});
