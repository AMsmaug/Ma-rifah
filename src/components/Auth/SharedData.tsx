import React, { useState, createContext } from "react";

type haveAccountProps = {
  children: React.ReactNode;
};

type contextType = {
  haveAnAccount: boolean;
  setHaveAnAccount: React.Dispatch<React.SetStateAction<boolean>>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const activeContext = createContext({} as contextType);

export const SharedData = ({ children }: haveAccountProps) => {
  const [haveAnAccount, setHaveAnAccount] = useState(true);

  return (
    <activeContext.Provider
      value={{
        haveAnAccount,
        setHaveAnAccount,
      }}
    >
      {children}
    </activeContext.Provider>
  );
};
