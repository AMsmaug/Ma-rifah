import { useContext } from "react";
import { Login } from "../components/Auth/login/Login.tsx";
import { SignUp } from "../components/Auth/signup/SignUp.tsx";
import { ActiveContext } from "../components/Auth/UserInfo.tsx";
import { useNavigate } from "react-router-dom";

export const Auth = () => {
  const { hasAnAccount } = useContext(ActiveContext);
  const navigate = useNavigate();
  return (
    <div className="container auth">
      <div className="intro">
        <h1>
          <span
            style={{ cursor: `pointer`, width: `fit-content` }}
            onClick={() => navigate(`/`)}
          >
            Ma'rifah
          </span>
        </h1>
        <p>
          Elevate your education with personalized learning. Your path to
          academic success starts here.
        </p>
      </div>
      <div className="validation">
        {hasAnAccount ? (
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
