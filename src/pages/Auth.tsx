import { useContext } from "react";
import { Login } from "../components/Auth/login/Login.tsx";
import { SignUp } from "../components/Auth/signup/SignUp.tsx";
import { activeContext } from "../components/Auth/SharedData.tsx";

export const Auth = () => {
  const { haveAnAccount } = useContext(activeContext);
  return (
    <div className="container auth">
      <div className="intro">
        <h1>Ma'rifah</h1>
        <p>
          Elevate your education with personalized learning. Your path to
          academic success starts here.
        </p>
      </div>
      <div className="validation">
        {haveAnAccount ? (
          <>
            <Login isActive={true} />
            <SignUp isActive={false} />
          </>
        ) : (
          <>
            <Login isActive={false} />
            <SignUp isActive={true} />
          </>
        )}
      </div>
    </div>
  );
};