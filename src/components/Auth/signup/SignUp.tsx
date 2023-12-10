import React, { FormEvent, useState, useContext, useEffect } from "react";
import { ActiveContext } from "../UserInfo.tsx";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import "./signup.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import {
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";

type prop = {
  isActive: boolean;
};

export const SignUp = ({ isActive }: prop) => {
  const [availableGrades, setAvailableGrades] = useState([]);
  const [userName, setUserName] = useState(``);
  const [email, setEmail] = useState(``);
  const [password, setPassword] = useState(``);
  const [passwordAgain, setPasswordAgain] = useState(``);
  const [grade, setGrade] = useState(1);
  const [gender, setGender] = useState(`m`);
  const [validation, setValidation] = useState({
    validUsername: true,
    validEmail: true,
    validPassword: true,
    samePasswords: true,
  });

  const navigate = useNavigate();

  const [authMessage, setAuthMessage] = useState(``);

  const { setHasAnAccount } = useContext(ActiveContext);

  useEffect(() => {
    axios.get(`http://localhost/Ma-rifah/get_grades.php`).then((response) => {
      setAvailableGrades(response.data);
    });
  }, []);

  const checkUserName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
    if (/\d+/.test(e.target.value)) {
      setValidation((prev) => {
        return {
          ...prev,
          validUsername: false,
        };
      });
      setAuthMessage(``);
    } else {
      setValidation((prev) => {
        return {
          ...prev,
          validUsername: true,
        };
      });
      setAuthMessage(``);
    }
  };

  const checkEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (/[a-z]\w+@\w+\.\w+/.test(e.target.value) || e.target.value === ``) {
      setValidation((prev) => {
        return {
          ...prev,
          validEmail: true,
        };
      });
      setAuthMessage(``);
    } else {
      setValidation((prev) => {
        return {
          ...prev,
          validEmail: false,
        };
      });
      setAuthMessage(``);
    }
  };

  const checkPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (e.target.value === passwordAgain && passwordAgain !== ``) {
      setValidation((prev) => {
        return {
          ...prev,
          samePasswords: true,
        };
      });
      setAuthMessage(``);
    } else {
      if (passwordAgain !== ``) {
        setValidation((prev) => {
          return {
            ...prev,
            samePasswords: false,
          };
        });
        setAuthMessage(``);
      }
    }
    if (
      /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(e.target.value) ||
      e.target.value === ``
    ) {
      setValidation((prev) => {
        return {
          ...prev,
          validPassword: true,
        };
      });
      setAuthMessage(``);
    } else {
      setValidation((prev) => {
        return {
          ...prev,
          validPassword: false,
        };
      });
      setAuthMessage(``);
    }
  };

  const checkPasswordSimilarity = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordAgain(e.target.value);
    if (e.target.value === password) {
      setValidation((prev) => {
        return {
          ...prev,
          samePasswords: true,
        };
      });
      setAuthMessage(``);
    } else {
      setValidation((prev) => {
        return {
          ...prev,
          samePasswords: false,
        };
      });
      setAuthMessage(``);
    }
  };

  const confirmData = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      userName === `` ||
      email === `` ||
      password === `` ||
      passwordAgain === ``
    ) {
      setAuthMessage(`*All fields are required!`);
    } else {
      const values = Object.values(validation);
      if (values.slice(0, values.length - 2).includes(false)) {
        setAuthMessage(`*Please enter the information correctly!`);
      } else {
        // post data
        let path;
        if (gender === `male`) {
          const imgNumber = Math.floor(Math.random() * 5);
          path = `../../../public/images/av${imgNumber}.png`;
        } else {
          const imgNumber = Math.round(Math.random() * (7 - 5) + 4);
          path = `../../../public/images/av${imgNumber}.png`;
        }
        axios
          .post(`http://localhost/Ma-rifah/authentication/Add_account.php`, {
            userName,
            email,
            password,
            gender,
            grade,
            path,
          })
          .then((response) => {
            const serverResponse: { code: number; message: string } =
              response.data;
            if (serverResponse.code === 409 || serverResponse.code === 500) {
              setAuthMessage(serverResponse.message);
            } else {
              // In case all the entered data are valid, the server will return the student id as a message.
              // The id will be used for all subsequent pages, so it's important to store it in a global place.
              Cookies.set(`id`, `${serverResponse.message}`);
              navigate(`/CoursesProgress`);
            }
          });
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
        <PersonIcon className="icon" />
        <input
          className="user-data"
          type="text"
          placeholder="Username"
          value={userName}
          onInput={checkUserName}
        />
      </div>
      <div className="inp">
        {!validation.validEmail && (
          <span className="error">*Invalid email</span>
        )}
        <EmailIcon className="icon" />
        <input
          className="user-data"
          type="email"
          placeholder="Email"
          value={email}
          onInput={checkEmail}
        />
      </div>
      <div className="inp">
        {!validation.validPassword && password.length < 8 ? (
          <span className="error">*Too short password!</span>
        ) : !validation.validPassword ? (
          <span className="error password-error">
            *This field must contain numbers and capital letters
          </span>
        ) : (
          ``
        )}
        <LockIcon className="icon" />
        <input
          className="user-data"
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
        <LockIcon className="icon" />
        {validation.validPassword && password !== `` ? (
          <input
            className="password-again user-data"
            type="password"
            placeholder="Password Again"
            value={passwordAgain}
            onInput={checkPasswordSimilarity}
          />
        ) : (
          <input
            className="password-again user-data"
            type="password"
            placeholder="Password Again"
            value={passwordAgain}
            onInput={checkPasswordSimilarity}
            disabled
          />
        )}
      </div>
      <label htmlFor="class" className="class">
        Which grade are you in?
      </label>
      <select
        name=""
        className="choose-class"
        id="class"
        value={grade}
        onChange={(e) => setGrade(+e.target.value)}
      >
        {availableGrades.map(
          (grade: { grade_id: number; grade_name: string }) => (
            <option value={grade.grade_id} key={grade.grade_id}>
              {grade.grade_name.replace(`Grade `, `Grade - `)}
            </option>
          )
        )}
      </select>
      <div className="inp">
        {<span className="error signup-error">{authMessage}</span>}
      </div>
      <label htmlFor="class" className="class gender">
        Choose your gender
      </label>
      <Box sx={{ display: `flex`, justifyContent: `center` }}>
        <FormControl>
          <RadioGroup
            name="genders"
            aria-labelledby="genders-label"
            value={gender}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setGender(e.target.value)
            }
            row
            sx={{ display: `flex`, gap: `20px` }}
          >
            <FormControlLabel
              control={<Radio size="small" color="primary" />}
              value={`m`}
              label="Male"
            />
            <FormControlLabel
              control={<Radio size="small" color="primary" />}
              value={`f`}
              label="Female"
            />
          </RadioGroup>
        </FormControl>
      </Box>
      <button className="sign-button">Sign up</button>

      {/* bla */}
      {/* <Box id={`signInWithGoogle`} sx={{ width: `100%` }}></Box> */}
      <p className="signup-button">
        Already have an account?
        <span
          className="login-here"
          onClick={() => {
            setHasAnAccount(true);
          }}
        >
          Login
        </span>
        here.
      </p>
    </form>
  );
};
