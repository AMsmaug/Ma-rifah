import React, { useState, createContext } from "react";

type haveAccountProps = {
  children: React.ReactNode;
};

type contextType = {
  // For authentication process
  hasAnAccount: boolean;
  setHasAnAccount: React.Dispatch<React.SetStateAction<boolean>>;
  // isLoggedIn: boolean;
  // login: () => void;
  logout: () => void;
  // ---------------------------------
  // For Question and answers feature
  userName: string;
  setUserName: React.Dispatch<React.SetStateAction<string>>;
  profileUrl: string;
  setProfileUrl: React.Dispatch<React.SetStateAction<string>>;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  grade: number | null;
  setgrade: React.Dispatch<React.SetStateAction<number | null>>;
  loggedInWithGoogle: boolean;
  setloggedInWithGoogle: React.Dispatch<React.SetStateAction<boolean>>;
  // ---------------------------------
};

// eslint-disable-next-line react-refresh/only-export-components
export const ActiveContext = createContext({} as contextType);

export const UserInfo = ({ children }: haveAccountProps) => {
  // For authentication process
  const [hasAnAccount, setHasAnAccount] = useState(true);
  // const [isLoggedIn, setisLoggedIn] = useState<boolean>(false);
  // ---------------------------------
  // For Question and answers feature
  const [userName, setUserName] = useState(``);
  const [profileUrl, setProfileUrl] = useState(``);
  const [email, setEmail] = useState("");
  const [grade, setgrade] = useState<null | number>(null);
  const [loggedInWithGoogle, setloggedInWithGoogle] = useState<boolean>(false);
  // ---------------------------------

  const logout = () => {
    setUserName("");
    setProfileUrl("");
    setEmail("");
    setgrade(null);
    setloggedInWithGoogle(false);
  };

  return (
    <ActiveContext.Provider
      value={{
        // For authentication process
        hasAnAccount,
        setHasAnAccount,
        logout,
        // For Question and answers feature
        userName,
        setUserName,
        profileUrl,
        setProfileUrl,
        email,
        setEmail,
        grade,
        setgrade,
        loggedInWithGoogle,
        setloggedInWithGoogle,
        // ---------------------------------
      }}
    >
      {children}
    </ActiveContext.Provider>
  );
};
