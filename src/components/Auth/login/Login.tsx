import { activeContext } from "../SharedData.tsx";
import React, { FormEvent, useState, useContext } from "react";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import "./login.css";

type prop = {
  isActive: boolean;
};

export const Login = ({ isActive }: prop) => {
  const [email, setEmail] = useState(``);
  const [password, setPassword] = useState(``);
  const [validation, setValidation] = useState({
    validEmail: true,
    sendData: true,
    correctData: true,
  });

  const { setHaveAnAccount } = useContext(activeContext);

  const checkEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (/[a-z]\w+@\w+\.\w+/.test(e.target.value) || e.target.value === ``) {
      setValidation((prev) => {
        return {
          ...prev,
          validEmail: true,
          sendData: true,
          correctData: true,
        };
      });
    } else {
      setValidation((prev) => {
        return {
          ...prev,
          validEmail: false,
          sendData: true,
          correctData: true,
        };
      });
    }
  };

  const checkPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);

    setValidation((prev) => {
      return {
        ...prev,
        sendData: true,
        correctData: true,
      };
    });
  };

  const confirmData = (e: FormEvent<HTMLFormElement>) => {
    if (email === `` || password === ``) {
      e.preventDefault();
      setValidation((prev) => {
        return {
          ...prev,
          sendData: false,
        };
      });
    } else {
      if (!validation.validEmail && !validation.sendData) {
        // fetch your data here, within this if statement
        e.preventDefault();
      } else {
        e.preventDefault();
        // post your data here
      }
    }
  };

  return (
    <form
      className={`login ${isActive ? `active` : ``}`}
      onSubmit={confirmData}
    >
      <div className="inp">
        {!validation.validEmail && (
          <span className="error">*Invalid email</span>
        )}
        <input
          type="text"
          placeholder="Email"
          value={email}
          onInput={checkEmail}
        />
        <EmailIcon className="icon" />
      </div>
      <div className="inp">
        <LockIcon className="icon" />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onInput={checkPassword}
        />
      </div>
      <div className="inp">
        {!validation.sendData && (
          <span className="error">*All fields are required</span>
        )}
        {!validation.correctData && (
          <span className="error">*Incorrect email or password</span>
        )}
      </div>

      <button className="sign-button">Log in</button>
      <p className="forgot-password">Forgot you password?</p>
      <p className="signup-now">
        Don't have an account?{" "}
        <span
          className="back"
          onClick={() => {
            setHaveAnAccount(false);
          }}
        >
          Sign up
        </span>{" "}
        here.
      </p>
    </form>
  );
};
