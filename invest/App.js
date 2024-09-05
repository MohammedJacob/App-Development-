import React from 'react';
import { UserProvider } from './UserContext';
import AppNavigator from './AppNavigator'; // Import the navigation component

const App = () => (
  <UserProvider>
    <AppNavigator />
  </UserProvider>
);

export default App;
