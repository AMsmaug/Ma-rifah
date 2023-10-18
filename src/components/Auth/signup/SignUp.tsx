import React, { FormEvent, useState, useContext } from "react";
import { activeContext } from "../SharedData.tsx";
import "./signup.css";

type prop = {
  isActive: boolean;
};

export const SignUp = ({ isActive }: prop) => {
  const [userName, setUserName] = useState(``);
  const [email, setEmail] = useState(``);
  const [password, setPassword] = useState(``);
  const [passwordAgain, setPasswordAgain] = useState(``);
  const [validation, setValidation] = useState({
    validUsername: true,
    validEmail: true,
    validPassword: true,
    samePasswords: true,
    sendData: true,
  });

  const { setHaveAnAccount } = useContext(activeContext);

  const checkUserName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
    console.log(/\d+/.test(e.target.value));
    if (/\d+/.test(e.target.value)) {
      setValidation((prev) => {
        return {
          ...prev,
          validUsername: false,
          sendData: true,
        };
      });
    } else {
      setValidation((prev) => {
        return {
          ...prev,
          validUsername: true,
          sendData: true,
        };
      });
    }
  };

  const checkEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (/[a-z]\w+@\w+\.\w+/.test(e.target.value) || e.target.value === ``) {
      setValidation((prev) => {
        return {
          ...prev,
          validEmail: true,
          sendData: true,
        };
      });
    } else {
      setValidation((prev) => {
        return {
          ...prev,
          validEmail: false,
          sendData: true,
        };
      });
    }
  };

  const checkPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (e.target.value === passwordAgain && passwordAgain !== ``) {
      setValidation((prev) => {
        return {
          ...prev,
          samePasswords: true,
          sendData: true,
        };
      });
    } else {
      if (passwordAgain !== ``) {
        setValidation((prev) => {
          return {
            ...prev,
            samePasswords: false,
            sendData: true,
          };
        });
      }
    }
    if (
      /^(?=.*[A-Z])(?=.*\d).+$/.test(e.target.value) ||
      e.target.value === ``
    ) {
      setValidation((prev) => {
        return {
          ...prev,
          validPassword: true,
          sendData: true,
        };
      });
    } else {
      setValidation((prev) => {
        return {
          ...prev,
          validPassword: false,
          sendData: true,
        };
      });
    }
  };

  const checkPasswordSimilarity = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordAgain(e.target.value);
    if (e.target.value === password) {
      setValidation((prev) => {
        return {
          ...prev,
          samePasswords: true,
          sendData: true,
        };
      });
    } else {
      setValidation((prev) => {
        return {
          ...prev,
          samePasswords: false,
          sendData: true,
        };
      });
    }
  };

  const confirmData = (e: FormEvent<HTMLFormElement>) => {
    if (
      userName === `` ||
      email === `` ||
      password === `` ||
      passwordAgain === ``
    ) {
      e.preventDefault();
      setValidation((prev) => {
        return {
          ...prev,
          sendData: false,
        };
      });
    } else {
      const values = Object.values(validation);
      if (values.slice(0, values.length - 1).includes(false)) {
        e.preventDefault();
      } else {
        // post data
      }
    }
  };

  return (
    <form
      className={`signup ${isActive ? `active` : ``}`}
      onSubmit={confirmData}
    >
      <div className="inp">
        {!validation.validUsername && (
          <span className="error">*A username must not contain numbers</span>
        )}
        <input
          type="text"
          placeholder="Username"
          value={userName}
          onInput={checkUserName}
        />
      </div>
      <div className="inp">
        {!validation.validEmail && <span className="error">*Ivalid email</span>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onInput={checkEmail}
        />
      </div>
      <div className="inp">
        {!validation.validPassword && (
          <span className="error">
            *field must contain numbers and capital letters
          </span>
        )}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onInput={checkPassword}
        />
      </div>
      <div className="inp">
        {!validation.samePasswords && (
          <span className="error">*The two passwords are not the same</span>
        )}
        {validation.validPassword && password !== `` ? (
          <input
            className="password-again"
            type="password"
            placeholder="Password Again"
            value={passwordAgain}
            onInput={checkPasswordSimilarity}
          />
        ) : (
          <input
            className="password-again"
            type="password"
            placeholder="Password Again"
            value={passwordAgain}
            onInput={checkPasswordSimilarity}
            disabled
          />
        )}
      </div>
      <div className="inp">
        {!validation.sendData && (
          <span className="error signup-error">*All fields are required</span>
        )}
      </div>
      <label htmlFor="class" className="class">
        Which grade are you in?
      </label>
      <select name="" className="choose-class" id="class">
        <option value="grade-7">Grade 7</option>
        <option value="grade-8">Grade 8</option>
        <option value="grade-9">Grade 9</option>
      </select>
      <button className="sign-button">Sign up</button>
      <p className="signup-button">
        Already have an account?{" "}
        <span
          className="login-here"
          onClick={() => {
            setHaveAnAccount(true);
          }}
        >
          Login
        </span>{" "}
        here.
      </p>
    </form>
  );
};
