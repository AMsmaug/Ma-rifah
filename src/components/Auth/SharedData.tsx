import React, { useState, createContext } from "react";

type haveAccountProps = {
  children: React.ReactNode;
};

type contextType = {
  // For authentication process
  hasAnAccount: boolean;
  setHasAnAccount: React.Dispatch<React.SetStateAction<boolean>>;
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
  // ---------------------------------
  // For Question and answers feature
  userName: string;
  setUserName: React.Dispatch<React.SetStateAction<string>>;
  profileUrl: string;
  setProfileUrl: React.Dispatch<React.SetStateAction<string>>;
  // ---------------------------------
};

// eslint-disable-next-line react-refresh/only-export-components
export const ActiveContext = createContext({} as contextType);

export const SharedData = ({ children }: haveAccountProps) => {
  // For authentication process
  const [hasAnAccount, setHasAnAccount] = useState(true);
  const [isLoggedIn, setisLoggedIn] = useState<boolean>(false);
  // ---------------------------------
  // For Question and answers feature
  const [userName, setUserName] = useState(``);
  const [profileUrl, setProfileUrl] = useState(``);
  // ---------------------------------

  const login = () => {
    setisLoggedIn(true);
  };

  const logout = () => {
    setisLoggedIn(false);
  };

  return (
    <ActiveContext.Provider
      value={{
        // For authentication process
        hasAnAccount,
        setHasAnAccount,
        isLoggedIn,
        login,
        logout,
        // ---------------------------------
        // For Question and answers feature
        userName,
        setUserName,
        profileUrl,
        setProfileUrl,
        // ---------------------------------
      }}
    >
      {children}
    </ActiveContext.Provider>
  );
};
