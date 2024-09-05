import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './HomePage';
import DetailPage from './DetailPage';
import SettingsScreen from './SettingScreen';
import LoginMethod from './login-method';
import LoginMethodEmail from './loginmethod-email';
import AboutUsScreen from './Aboutus';
import PaymentScreen from './payment';
import ProfileScreen from './Profile';
import WalletScreen from './Wallet';
import PrivacyPolicyScreen from './Privacypolicy';
import PortfolioScreen from './Portfolio';
import DepositPage from './depositpage';
import WithdrawPage from './Withdrawpage';
import Onboarding from './Onboarding';
import SignUp from './SignUp';

const Stack = createStackNavigator();

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="SignUp">
      <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Details" component={DetailPage} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="LoginMethod" component={LoginMethod} options={{ headerShown: false }} />
      <Stack.Screen name="LoginMethodEmail" component={LoginMethodEmail} options={{ headerShown: false }} />
      <Stack.Screen name="About Us" component={AboutUsScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Wallet" component={WalletScreen} />
      <Stack.Screen name="Privacy Policy" component={PrivacyPolicyScreen} />
      <Stack.Screen name="Portfolio" component={PortfolioScreen} />
      <Stack.Screen name="Deposit" component={DepositPage} />
      <Stack.Screen name="Withdraw" component={WithdrawPage} />
      <Stack.Screen name="Onboarding" component={Onboarding} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
