import { ActiveContext } from "../UserInfo.tsx";
import React, { FormEvent, useState, useContext } from "react";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import "./login.css";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { Box, FormControlLabel, Checkbox } from "@mui/material";
import Cookies from "js-cookie";

type prop = {
  isActive: boolean;
};

export const Login = ({ isActive }: prop) => {
  const [email, setEmail] = useState(``);
  const [password, setPassword] = useState(``);
  const [validEmail, setvalidEmail] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [authMessage, setAuthMessage] = useState(``);

  const navigate = useNavigate();

  const { setHasAnAccount, setUserName, setProfileUrl } =
    useContext(ActiveContext);

  if (Cookies.get(`isLoggedIn`)) {
    return <Navigate to={`/CoursesProgress`} replace={true} />;
  } else {
    const checkEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(e.target.value);
      // checking the email format
      if (/[a-z]\w+@\w+\.\w+/.test(e.target.value) || e.target.value === ``) {
        setvalidEmail(true);
        setAuthMessage(``);
      } else {
        setvalidEmail(false);
        setAuthMessage(``);
      }
    };

    const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value);
      setAuthMessage(``);
    };

    const confirmData = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      // determining whether one of the input fields is empty
      if (email === `` || password === ``) {
        setAuthMessage(`*All fields are required!`);
      } else {
        // checking if the entered email is valid
        if (!validEmail) {
          setAuthMessage(`*Please enter the information correctly!`);
        } else {
          // posting data and checking its authenticity
          axios
            .post(`http://localhost/Ma-rifah/Verify_auth_credentials.php`, {
              email,
              password,
            })
            .then((response) => {
              const responseData: {
                code: number;
                message: { id: number; name: string; profile: string };
              } = response.data;
              if (responseData.code === 401) {
                // [404 => Not found]: There is no such account
                // [401 => Unauthorized]: Wrong password, lacks valid authentication credentials
                setAuthMessage(`*${responseData.message}`);
              } else {
                // The student account have been verified
                if (isLoggedIn) {
                  // In case he has checked the remember device box
                  console.log(`login, at 77`);
                  const expirationDate = new Date();
                  expirationDate.setMonth(expirationDate.getMonth() + 1);
                  Cookies.set(`isLoggedIn`, `true`, {
                    expires: expirationDate,
                    path: "/",
                  });
                  // The id will be used for all subsequent pages, so it's important to store it in a global place.
                  console.log(`login, at 85`);
                  Cookies.set(`id`, `${responseData.message.id}`, {
                    expires: expirationDate,
                    path: "/",
                  });
                } else {
                  console.log(`login, at 91`);
                  // In case he want to log in without checking the remember device box, the id will be carried by the cookies only for the current session.
                  Cookies.set(`id`, `${responseData.message.id}`, {
                    path: `/`,
                  });
                }
                setUserName(responseData.message.name);
                setProfileUrl(responseData.message.profile);
                navigate(`/coursesProgress`, { replace: true });
              }
            });
        }
      }
    };

    return (
      <form
        className={`login ${isActive ? `active` : ``}`}
        onSubmit={confirmData}
      >
        <div className="inp">
          {!validEmail && <span className="error">*Invalid email</span>}
          <input
            className="user-data"
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
            className="user-data"
            placeholder="Password"
            value={password}
            onInput={handlePassword}
          />
        </div>
        <div className="inp">
          {<span className="error">{authMessage}</span>}
        </div>

        <button className="sign-button">Log in</button>
        <p className="forgot-password">Forgot you password?</p>
        <p className="signup-now">
          Don't have an account?
          <span
            className="back"
            onClick={() => {
              setHasAnAccount(false);
            }}
          >
            Sign up
          </span>
          here.
        </p>
        <Box sx={{ position: `absolute`, bottom: `-80px` }}>
          <FormControlLabel
            label="Remember device"
            control={
              <Checkbox
                checked={isLoggedIn}
                onChange={() => setIsLoggedIn((remember) => !remember)}
              />
            }
          />
        </Box>
      </form>
    );
  }
};
