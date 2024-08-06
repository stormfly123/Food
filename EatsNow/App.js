import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './Components/SplashScreen';;
import OnboardingScreen from './Components/OnboardingScreen';
import SignIn from './Components/SignIn';
import SignUp from './Components/SignUp';
import HomeScreen from './Components/HomeScreen';
import ProfileSettingScreen from './Components/ProfileSettingScreen';
import PersonalDataScreen from './Components/PersonalDataScreen';
import NotificationPage from './Components/NotificationPage';
import OrderScreen from './Components/OrderScreen';
import InsightScreen from './Components/InsightScreen';
import CartScreen from './Components/CartScreen';
import CheckoutScreen from './Components/CheckoutScreen';
import MenueScreen from './Components/MenueScreen';
import PaymentScreen from './Components/PaymentScreen';
import VendorProfileScreen from './Components/VendorProfileScreen';
import { MealProvider } from './Components/MealContext';

const Stack = createStackNavigator();

const App = () => {
  return (
    <MealProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="SplashScreen">
          <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
          <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} options={{ headerShown: false }} />
          <Stack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }} />
          <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="ProfileSettingScreen" component={ProfileSettingScreen} options={{ headerShown: false }} />
          <Stack.Screen name="PersonalDataScreen" component={PersonalDataScreen} options={{ headerShown: false }} />
          <Stack.Screen name="NotificationPage" component={NotificationPage} options={{headerShown:false}} />
          <Stack.Screen name="OrderScreen" component={OrderScreen} options={{ headerShown: false }} />
          <Stack.Screen name="InsightScreen" component={InsightScreen} options={{ headerShown: false }} />
          <Stack.Screen name="CartScreen" component={CartScreen} options={{ headerShown: false }} />
          <Stack.Screen name="CheckoutScreen" component={CheckoutScreen} options={{ headerShown: false }} />
          <Stack.Screen name="PaymentScreen" component={PaymentScreen} options={{ headerShown: false }} />
          <Stack.Screen name="MenueScreen" component={MenueScreen} options={{ headerShown: false }} />
          <Stack.Screen name="VendorProfileScreen" component={VendorProfileScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </MealProvider>
  );
};

export default App;
