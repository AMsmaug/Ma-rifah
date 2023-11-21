import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import { ActiveContext } from "./SharedData";
import { useContext } from "react";

type propsType = {
  children: React.ReactNode;
};

export const RequireAuth = ({ children }: propsType) => {
  const { isLoggedIn } = useContext(ActiveContext);
  if (!Cookies.get(`isLoggedIn`) && !isLoggedIn) {
    // rejected approach, fix it later
    return <Navigate to={`/login`} />;
  } else {
    return children;
  }
};
