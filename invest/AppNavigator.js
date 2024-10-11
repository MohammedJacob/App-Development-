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
import TandCScreen from './T&C';
import TandCdetails from './T&Cdetails';
import ChangePassword from './Changepassword';
import Welcome from './Welcome';



const Stack = createStackNavigator();

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="SignUp">
      <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Details" component={DetailPage} options={{ headerShown: false }} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="LoginMethod" component={LoginMethod} options={{ headerShown: false }} />
      <Stack.Screen name="LoginMethodEmail" component={LoginMethodEmail} options={{ headerShown: false }} />
      <Stack.Screen name="About Us" component={AboutUsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Payment" component={PaymentScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Wallet" component={WalletScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Privacy Policy" component={PrivacyPolicyScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Portfolio" component={PortfolioScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Deposit" component={DepositPage} options={{ headerShown: false }} />
      <Stack.Screen name="Withdraw" component={WithdrawPage} options={{ headerShown: false }} />
      <Stack.Screen name="Welcome" component={Welcome} options={{ headerShown: false }} />
      <Stack.Screen name="Onboarding" component={Onboarding} options={{ headerShown: false }} />
      <Stack.Screen name="TandC" component={TandCScreen} options={{ headerShown: false }} />
      <Stack.Screen name="TandCdetails" component={TandCdetails} options={{ headerShown: false }} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} options={{ headerShown: false }} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
