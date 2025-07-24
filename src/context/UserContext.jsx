import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: 'Guest',
    isLoggedIn: false,
    preferences: {},
  });

  const login = (username) => {
    setUser({ name: username, isLoggedIn: true, preferences: {} });
  };

  const logout = () => {
    setUser({ name: 'Guest', isLoggedIn: false, preferences: {} });
  };

  const updatePreferences = (newPreferences) => {
    setUser((prevUser) => ({
      ...prevUser,
      preferences: { ...prevUser.preferences, ...newPreferences },
    }));
  };

  return (
    <UserContext.Provider value={{ user, login, logout, updatePreferences }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);


