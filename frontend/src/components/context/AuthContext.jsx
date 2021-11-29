import React, { useContext, createContext, useState } from 'react';
import { read } from '../../service/localStorage.service';

const authContext = createContext();

const ProvideAuth = ({ children }) => {
  const [account, setAccount] = useState(read('account') || undefined);
  const [token, setToken] = useState(read('token') || undefined);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const signin = (account, token) => {
    setAccount(account);
    setToken(token);
  };

  const signout = () => {
    setAccount(null);
    setToken(null);
  };

  const openLoginModal = () => {
    setShowLoginModal(true);
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
  };

  return (
    <authContext.Provider
      value={{
        account,
        token,
        signin,
        signout,
        showLoginModal,
        openLoginModal,
        closeLoginModal,
      }}
    >
      {children}
    </authContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(authContext);
};

export default ProvideAuth;
