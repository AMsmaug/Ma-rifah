import { ActiveContext } from "../UserInfo.tsx";
import React, {
  FormEvent,
  useState,
  useContext,
  useEffect,
  forwardRef,
} from "react";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import "./login.css";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import {
  Box,
  FormControlLabel,
  Checkbox,
  Stack,
  Button,
  Snackbar,
  Alert,
  AlertProps,
  DialogContent,
  DialogTitle,
  Dialog,
  DialogActions,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import Cookies from "js-cookie";
import { gapi } from "gapi-script";
import GoogleLogin, {
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from "react-google-login";

type prop = {
  isActive: boolean;
};

export const Login = ({ isActive }: prop) => {
  const [email, setEmail] = useState(``);
  const [password, setPassword] = useState(``);
  const [validEmail, setvalidEmail] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [openClassDialog, setOpenClassDialog] = useState(false);
  const [availableGrades, setAvailableGrades] = useState([]);
  const [grade, setGrade] = useState(1);
  const [googleInfo, setGoogleInfo] = useState(
    {} as { username: string; email: string; picture: string }
  );

  const [authMessage, setAuthMessage] = useState(``);

  const navigate = useNavigate();

  const searchParams = new URLSearchParams(window.location.search);
  const source = searchParams.get(`src`);

  const { setHasAnAccount, setUserName, setProfileUrl } =
    useContext(ActiveContext);

  // after verifying the authentication credentials, the following function will be invoked
  const afterLogin = (id: number, name: string, picture?: string) => {
    if (isLoggedIn) {
      // In case he has checked the remember device box
      const expirationDate = new Date();
      expirationDate.setMonth(expirationDate.getMonth() + 1);
      // The id will be used for all subsequent pages, so it's important to store it in a global place.
      Cookies.set(`id`, `${id}`, {
        expires: expirationDate,
        path: "/",
      });
    } else {
      // In case he wants to log in without checking the remember device box, the id will be carried by the cookies only for the current session.
      Cookies.set(`id`, `${id}`, {
        path: `/`,
      });
    }
    setUserName(name);
    if (picture !== undefined) {
      setProfileUrl(picture);
    }
    switch (source) {
      case `land`:
        navigate(`/Courses`, { replace: true });
        break;
      case `QA`:
        navigate(`/Q&A`, { replace: true });
        break;
      default:
        navigate(`/noContentFound`, { replace: true });
        break;
    }
  };

  // This block of code is for google sevices
  // Start block
  const clientId = `723638483192-kfov361ell0v3o6p3vrpdim7v8uujthv.apps.googleusercontent.com`;

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: clientId,
        scope: ``,
      });
    }

    gapi.load(`client:auth2`, start);
  }, [clientId]);

  const onSuccess = (googleUser: {
    getBasicProfile: () => {
      getEmail: () => string;
      getName: () => string;
      getImageUrl: () => string;
    };
    getAuthResponse: () => { id_token: string };
  }) => {
    if (googleUser) {
      // const token = googleUser.getAuthResponse()?.id_token;
      const profile = googleUser.getBasicProfile();
      setGoogleInfo({
        username: profile.getName(),
        email: profile.getEmail(),
        picture: profile.getImageUrl(),
      });
      const username = profile.getName();
      const email = profile.getEmail();
      // const picture = profile.getImageUrl();
      axios
        .post(
          `http://localhost/Ma-rifah/authentication/login_with_google/check_user_existence.php`,
          email
        )
        .then((response) => {
          const responseData: {
            status: string;
            id: number;
          } = response.data;
          if (responseData.status === `exists`) {
            afterLogin(responseData.id, username);
          } else {
            axios
              .get(`http://localhost/Ma-rifah/get_grades.php`)
              .then((response) => {
                setAvailableGrades(response.data);
              })
              .then(() => {
                setOpenClassDialog(true);
              });
          }
        });
    } else {
      console.error(
        "error during login with google: google user information is undefined"
      );
      setOpenError(true);
    }
  };

  const onFailure = (error: unknown) => {
    console.log(`error during login with google: ${error}`);
    setOpenError(true);
  };

  const [openError, setOpenError] = useState(false);

  const handleErrorClose = () => {
    setOpenError(false);
  };

  const SnackbarAlert = forwardRef<HTMLDivElement, AlertProps>(
    function SnackBarAlert(props, ref) {
      return <Alert elevation={6} ref={ref} {...props} />;
    }
  );

  const createAccountWithGoogle = () => {
    setOpenClassDialog(false);
    axios
      .post(
        `http://localhost/Ma-rifah/authentication/login_with_google/create_account_with_google.php`,
        { ...googleInfo, grade }
      )
      .then((response: { data: number }) => {
        console.log(response.data);
        const studentId = response.data;
        afterLogin(studentId, googleInfo.username, googleInfo.picture);
      });
  };

  // End block

  const checkEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    // checking the email format
    if (/[a-z0-9]\w+@\w+\.\w+/.test(e.target.value) || e.target.value === ``) {
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
          .post(
            `http://localhost/Ma-rifah/authentication/Verify_auth_credentials.php`,
            {
              email,
              password,
            }
          )
          .then((response) => {
            const responseData: {
              code: number;
              message: { id: number; name: string; picture: string };
            } = response.data;
            if (responseData.code === 401) {
              // [404 => Not found]: There is no such account
              // [401 => Unauthorized]: Wrong password, lacks valid authentication credentials
              setAuthMessage(`*${responseData.message}`);
            } else {
              // The student account have been verified
              afterLogin(responseData.message.id, responseData.message.name);
            }
          });
      }
    }
  };

  return (
    <>
      {source ? (
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
          <Box textAlign={`center`} margin={`5px 0 20px`} fontSize={`20px`}>
            or
          </Box>
          <Box>
            <GoogleLogin
              clientId={clientId}
              buttonText="Sign up with google"
              onSuccess={
                onSuccess as (
                  response: GoogleLoginResponse | GoogleLoginResponseOffline
                ) => void
              }
              onFailure={onFailure}
              cookiePolicy="single_host_origin"
              isSignedIn={false}
              render={(renderProps) => {
                return (
                  <Button
                    onClick={renderProps.onClick}
                    sx={{
                      width: `100%`,
                      backgroundColor: `#13213c`,
                      color: `white`,
                      marginBottom: `60px`,
                      borderRadius: `12px`,
                      "&:hover": {
                        backgroundColor: `#06142c`,
                      },
                    }}
                  >
                    <Stack gap={`20px`} direction={`row`} alignItems={`center`}>
                      <Stack
                        justifyContent={`center`}
                        alignItems={`center`}
                        bgcolor={`white`}
                        borderRadius={`50%`}
                        className="google-button"
                        sx={{
                          fontSize: {
                            xs: `12px`,
                            sm: `12px`,
                            md: `16px`,
                            lg: `16px`,
                          },
                          width: {
                            xs: `25px`,
                            sm: `25px`,
                            md: `30px`,
                            lg: `30px`,
                          },
                          height: {
                            xs: `25px`,
                            sm: `25px`,
                            md: `30px`,
                            lg: `30px`,
                          },
                        }}
                      >
                        <GoogleIcon
                          color="secondary"
                          className="google-icon"
                          sx={{
                            fontSize: `18px`,
                          }}
                        />
                      </Stack>
                      <Typography
                        sx={{
                          fontSize: {
                            xs: `14px`,
                            sm: `14px`,
                            md: `16px`,
                            lg: `16px`,
                          },
                        }}
                      >
                        Login with google
                      </Typography>
                    </Stack>
                  </Button>
                );
              }}
            />
          </Box>
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
          <Box>
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

          <Dialog
            open={openClassDialog}
            onClose={() => setOpenClassDialog(false)}
            aria-labelledby="dialog-title"
            aria-describedby="dialog-description"
            PaperProps={{
              style: {
                borderRadius: "12px",
                padding: "20px",
              },
            }}
          >
            <DialogTitle
              color={`primary`}
              sx={{ textAlign: `center`, fontSize: `24px`, fontWeight: `bold` }}
            >
              Please choose your grade first:
            </DialogTitle>
            <DialogContent>
              <DialogActions>
                <TextField
                  label="select grade"
                  select
                  fullWidth
                  value={grade}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const value = e.target.value;
                    setGrade(+value);
                  }}
                  sx={{ margin: `10px 0` }}
                >
                  {availableGrades.map(
                    (grade: { grade_id: number; grade_name: string }) => (
                      <MenuItem value={grade.grade_id} key={grade.grade_id}>
                        {grade.grade_name.replace(`Grade `, `Grade - `)}
                      </MenuItem>
                    )
                  )}
                </TextField>
              </DialogActions>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setOpenClassDialog(false)}
                sx={{
                  backgroundColor: `#13213c`,
                  color: `white`,
                  margin: "0 auto",
                  "&:hover": {
                    backgroundColor: `#06142c`,
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={createAccountWithGoogle}
                sx={{
                  backgroundColor: `#13213c`,
                  color: `white`,
                  margin: "0 auto",
                  "&:hover": {
                    backgroundColor: `#06142c`,
                  },
                }}
              >
                Ok
              </Button>
            </DialogActions>
          </Dialog>
        </form>
      ) : (
        <Navigate to={`/NoContentFound`} />
      )}
      <Snackbar
        anchorOrigin={{ vertical: `bottom`, horizontal: `right` }}
        open={openError}
        autoHideDuration={6000}
        onClose={handleErrorClose}
      >
        <SnackbarAlert severity="error" onClose={handleErrorClose}>
          Error during login!
        </SnackbarAlert>
      </Snackbar>
    </>
  );
};
