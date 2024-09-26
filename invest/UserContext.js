import React, { createContext, useContext, useState } from 'react';

// Create the UserContext
const UserContext = createContext();

// Create a provider component
export function UserProvider({ children }) {
  const [userData, setUserData] = useState({
    user_id: null, // Initialize with null or default value
    email_address: null,
    password  : null,
    
    // Add other user details if needed
  });

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook for using the context
export function useUser() {
  return useContext(UserContext);
}
