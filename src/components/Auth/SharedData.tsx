import React, { useState, createContext } from "react";

type haveAccountProps = {
  children: React.ReactNode;
};

type contextType = {
  hasAnAccount: boolean;
  setHasAnAccount: React.Dispatch<React.SetStateAction<boolean>>;
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
};

// eslint-disable-next-line react-refresh/only-export-components
export const ActiveContext = createContext({} as contextType);

export const SharedData = ({ children }: haveAccountProps) => {
  const [hasAnAccount, setHasAnAccount] = useState(true);
  const [isLoggedIn, setisLoggedIn] = useState<boolean>(false);

  const login = () => {
    setisLoggedIn(true);
  };

  const logout = () => {
    setisLoggedIn(false);
  };

  return (
    <ActiveContext.Provider
      value={{
        hasAnAccount,
        setHasAnAccount,
        isLoggedIn,
        login,
        logout,
      }}
    >
      {children}
    </ActiveContext.Provider>
  );
};
