import React, { createContext, useContext, useState } from 'react';

export const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  const [loginId, setLoginId] = useState({
    login_id:'',
    profile_id: '',
  });

  return (
    <LoginContext.Provider value={{ loginId, setLoginId }}>
      {children}
    </LoginContext.Provider>
  );
};

// Custom hook for easy access
export const useLogin = () => useContext(LoginContext);
