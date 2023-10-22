import React, { useState, createContext } from "react";

type haveAccountProps = {
  children: React.ReactNode;
};

type contextType = {
  hasAnAccount: boolean;
  setHasAnAccount: React.Dispatch<React.SetStateAction<boolean>>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const activeContext = createContext({} as contextType);

export const SharedData = ({ children }: haveAccountProps) => {
  const [hasAnAccount, setHasAnAccount] = useState(true);

  return (
    <activeContext.Provider
      value={{
        hasAnAccount,
        setHasAnAccount,
      }}
    >
      {children}
    </activeContext.Provider>
  );
};
