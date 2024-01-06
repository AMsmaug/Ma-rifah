import {
  Box,
  Stack,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

import "./profile.css";

import Cookies from "js-cookie";

import { LoadingButton } from "@mui/lab";

import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";

import axios from "axios";

import { useEffect, useState, useRef } from "react";

type ProfilePropsType = {
  profilePictureUrl: string;
  setprofilePicture: React.Dispatch<React.SetStateAction<string>>;
  name: string;
  setname: React.Dispatch<React.SetStateAction<string>>;
  grade: number | null;
  closeProfilePopup: () => void;
  loggedInWithGoogle: boolean;
  logout: () => void;
  handleSnackBarClick: () => void;
};

export const Profile = (props: ProfilePropsType) => {
  const {
    closeProfilePopup,
    name,
    grade,
    profilePictureUrl,
    setprofilePicture,
    setname,
    loggedInWithGoogle,
    logout,
    handleSnackBarClick,
  } = props;

  const [Name, setName] = useState<string>("");

  const [availableGrades, setAvailableGrades] = useState([]);

  const [image, setImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [validName, setvalidName] = useState<boolean | null>(true);
  const [validPasswords, setvalidPasswords] = useState<boolean | null>(null);
  const [invalidPasswordCause, setinvalidPasswordCause] = useState<string>("");
  const [passwordsNotTheSame, setpasswordsNotTheSame] = useState<
    boolean | null
  >(null);

  const [oldPasswordIncorrect, setoldPasswordIncorrect] = useState<
    boolean | null
  >(null);

  const [ischangeClassWarningOpen, setischangeClassWarningOpen] =
    useState<boolean>(false);

  const [studentClassId, setstudentClassId] = useState<number>(0);
  const [choosenClassId, setchoosenClassId] = useState<number>(0);

  const [loadingEditingProfile, setloadingEditingProfile] =
    useState<boolean>(false);

  const profilePicInputRef = useRef<HTMLInputElement>(null!);
  const nameRef = useRef<HTMLInputElement>(null!);
  const oldPasswordRef = useRef<HTMLInputElement>(null!);
  const newPasswordRef = useRef<HTMLInputElement>(null!);
  const confirmNewPasswordRef = useRef<HTMLInputElement>(null!);

  const navigate = useNavigate();

  const handleClick = () => {
    profilePicInputRef?.current.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target?.files;

    if (files && files.length > 0) {
      const file = files[0];

      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string | null);
      };
      reader.readAsDataURL(file);

      setSelectedFile(file);
    }
  };

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("fileInput", file);

    try {
      const response = await axios.post(
        "http://localhost:/Ma-rifah/upload_image.php",
        formData
      );

      if (profilePictureUrl) {
        // Make an API call to remove the previous image
        try {
          axios.post("http://localhost:/Ma-rifah/remove_image.php", {
            imageURL: profilePictureUrl,
          });
        } catch (error) {
          console.error("Error removing previous image", error);
        }
      }

      console.log(response);
      return response;
    } catch (error) {
      console.error("Error during file upload:", error);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.currentTarget.value);
    if (!/^[a-zA-Z]+(?:[-' ][a-zA-Z]+)*$/.test(e.currentTarget.value)) {
      setvalidName(false);
    } else {
      setvalidName(true);
    }
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pattern = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

    const newPass = e.currentTarget.value;
    const confirmNewPass = confirmNewPasswordRef.current.value;

    if (newPass.length < 8) {
      setinvalidPasswordCause("*password is too short");
      setvalidPasswords(false);
    } else if (!pattern.test(newPass)) {
      setinvalidPasswordCause(
        "*password should contains at least one capital letter and one digit"
      );
      setvalidPasswords(false);
    } else {
      setinvalidPasswordCause("");
    }
    if (confirmNewPass.length > 0 && confirmNewPass !== newPass) {
      setpasswordsNotTheSame(true);
      setvalidPasswords(false);
    } else if (confirmNewPass.length > 0 && confirmNewPass === newPass) {
      setpasswordsNotTheSame(false);
      setvalidPasswords(true);
    }
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.currentTarget.value !== newPasswordRef.current.value) {
      setpasswordsNotTheSame(true);
      setvalidPasswords(false);
    } else {
      setpasswordsNotTheSame(false);
      setvalidPasswords(true);
    }
  };

  const handleGradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setchoosenClassId(Number(e.currentTarget.value));
    setischangeClassWarningOpen(true);
  };

  const confirmChangeGrade = () => {
    setstudentClassId(choosenClassId);
    setischangeClassWarningOpen(false);
  };

  const cancelChangeGrade = () => {
    setischangeClassWarningOpen(false);
  };

  const handleEditProfile = async () => {
    if (
      validPasswords === null &&
      Name === name &&
      image === profilePictureUrl &&
      grade === studentClassId
    ) {
      console.log("nothing has changed");
      return;
    }

    const oldPass = oldPasswordRef?.current?.value;
    const newPass = newPasswordRef?.current?.value;

    const inputs: {
      studentId: string | undefined;
      studentName: string;
      imageURL: string;
      password: string | null;
      classId: number;
    } = {
      studentId: Cookies.get("id"),
      studentName: Name,
      imageURL: profilePictureUrl,
      password: null,
      classId: studentClassId,
    };

    if (validName === false) return;
    if (validPasswords === false) return;

    if (validPasswords) {
      try {
        setloadingEditingProfile(true);
        const response = await axios.post(
          "http://localhost/Ma-rifah/confirmOldPassword.php",
          {
            studentId: Cookies.get("id"),
            password: oldPass,
          }
        );

        if (response.data.status === "success") {
          if (response.data.message === "old password correct") {
            inputs.password = newPass;
            setoldPasswordIncorrect(false);
          } else {
            console.log("old password incorrect");
            setoldPasswordIncorrect(true);
            setloadingEditingProfile(false);
            return;
          }
        }
      } catch (error) {
        console.log("error");
      }
    } else if (validPasswords === false) {
      return;
    }

    if (selectedFile) {
      const response = await uploadFile(selectedFile);
      if (response?.data.status === "success") {
        const imageURL = response?.data.filePath;
        inputs.imageURL = imageURL;
      } else {
        console.error("Failed to edit profile picture.");
      }
    }
    console.log(inputs);
    try {
      setloadingEditingProfile(true);
      const response = await axios.post(
        "http://localhost/Ma-rifah/edit_profile.php",
        inputs
      );
      if (response.data.status === "success") {
        if (validPasswords) {
          Cookies.remove("id");
          navigate("/login?src=land", { replace: true });
          logout();
        } else if (grade !== studentClassId) {
          Cookies.remove("id");
          navigate("/login?src=land", { replace: true });
          logout();
        } else {
          setname(Name);
          setprofilePicture(inputs.imageURL);
          try {
            handleSnackBarClick();
          } catch (error) {
            console.log(error);
          }
          closeProfilePopup();
        }
      } else {
        console.log("error editing profile");
      }
    } catch (error) {
      console.log(error);
    }
    setloadingEditingProfile(false);
  };

  useEffect(() => {
    axios.get(`http://localhost/Ma-rifah/get_grades.php`).then((response) => {
      setAvailableGrades(response.data);
    });
    setImage(profilePictureUrl);
    setName(name);
    if (grade !== null) setstudentClassId(grade);
  }, [profilePictureUrl, name, grade]);

  return (
    <Box
      sx={{
        position: "fixed",
        zIndex: "1350",
        right: "0",
        bottom: "0",
        top: "0",
        left: "0",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          position: "fixed",
          right: "0",
          bottom: "0",
          top: "0",
          left: "0",
          backgroundColor: "#00000070",
          zIndex: "-1",
          backdropFilter: "blur(1.5px)",
        }}
      />
      <Stack
        sx={{
          backgroundColor: "#fff",
          color: "rgba(0, 0, 0, 0.87)",
          borderRadius: "5px",
          margin: {
            xs: "0",
            sm: "10px",
          },
          padding: "10px 15px",
          position: "relative",
          boxShadow:
            "0px 11px 15px -7px rgba(0,0,0,0.2), 0px 24px 38px 3px rgba(0,0,0,0.14), 0px 9px 46px 8px rgba(0,0,0,0.12)",
          width: {
            xs: "100%",
            sm: "500px",
            md: "600px",
            lg: "800px",
          },
        }}
      >
        {/* profile picture */}
        <Box
          sx={{
            width: {
              xs: "140px",
              sm: "200px",
            },
            height: {
              xs: "140px",
              sm: "200px",
            },
            border: "2px solid white",
            borderRadius: "50%",
            margin: "0 auto",
            transform: {
              xs: "translateY(-50px)",
              sm: "translateY(-70px)",
            },
          }}
          onClick={handleClick}
        >
          <Box
            sx={{
              height: "100%",
              overflow: "hidden !important",
              borderRadius: "50%",
            }}
            className="profile-image-holder"
          >
            <Box className="content-overlay"></Box>
            <Box className="content-details fadeIn-bottom">
              <p className="content-text">Change picture</p>
            </Box>

            <Box
              sx={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                overflow: "hidden",
              }}
            >
              {image !== "null" ? (
                <img
                  src={image !== null ? image : ""}
                  width="100%"
                  height="100%"
                  style={{ objectFit: "cover" }}
                  alt=""
                />
              ) : (
                <Stack
                  width="100%"
                  height="100%"
                  justifyContent="center"
                  alignItems="center"
                  fontSize={80}
                  bgcolor="primary.main"
                >
                  {Name[0]?.toUpperCase()}
                </Stack>
              )}
            </Box>
          </Box>
          <Box className="icon-holder">
            <CameraAltIcon />
          </Box>
          <input
            ref={profilePicInputRef}
            className="profile-picture-input"
            type="file"
            onChange={handleFileInputChange}
          />
        </Box>

        <Box mt={-5} className="profile-fields-container">
          {/* Change name */}
          {validName === false && (
            <Typography color="error" mb={1} ml={1}>
              *A name should not contain special characters or digits
            </Typography>
          )}
          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            justifyContent="space-between"
            alignItems="center"
            gap={{ xs: "10px", sm: "15px" }}
            mb={{
              xs: "15px",
              sm: "35px",
            }}
          >
            <Box
              fontWeight="bold"
              fontSize={18}
              minWidth={165}
              textAlign={{
                xs: "center",
                sm: "start",
              }}
              pl={{
                xs: "0px",
                sm: "16px",
              }}
            >
              Full Name:
            </Box>
            <input
              value={Name}
              className="set-profile-field set-profile-name"
              type="text"
              ref={nameRef}
              onChange={handleNameChange}
            />
          </Stack>
          {/* Change password in case user is not logged in with google */}
          {!loggedInWithGoogle && (
            <Accordion
              sx={{
                backgroundColor: "transparent",
                boxShadow: "none",
                mb: {
                  xs: "15px",
                  sm: "25px",
                },
                "&:before": {
                  height: "0",
                },
              }}
            >
              <AccordionSummary
                sx={{
                  backgroundColor: "#eee",
                  fontWeight: "bold",
                  fontSize: "18px",
                  borderRadius: "6px",
                  mb: "10px",
                }}
                expandIcon={<ExpandMoreIcon color="secondary" />}
              >
                Change Password
              </AccordionSummary>
              <AccordionDetails>
                {oldPasswordIncorrect && (
                  <Typography color="error" mb={1} ml={1}>
                    *Old password incorrect
                  </Typography>
                )}
                {/* old password */}
                <Stack
                  direction={{
                    xs: "column",
                    sm: "row",
                  }}
                  justifyContent="center"
                  alignItems="center"
                  gap={{ xs: "8px", sm: "20px" }}
                  mb={{
                    xs: "15px",
                    sm: "25px",
                  }}
                >
                  <Box
                    fontWeight="bold"
                    fontSize={18}
                    minWidth={165}
                    textAlign={{
                      xs: "center",
                      sm: "start",
                    }}
                  >
                    Old Password:
                  </Box>
                  <input
                    className="set-profile-field"
                    type="password"
                    ref={oldPasswordRef}
                  />
                </Stack>
                {invalidPasswordCause.length > 0 && (
                  <Typography color="error" mb={1} ml={1}>
                    {invalidPasswordCause}
                  </Typography>
                )}
                {/* New password */}
                <Stack
                  direction={{
                    xs: "column",
                    sm: "row",
                  }}
                  justifyContent="center"
                  alignItems="center"
                  gap={{ xs: "8px", sm: "20px" }}
                  mb={{
                    xs: "15px",
                    sm: "25px",
                  }}
                >
                  <Box
                    fontWeight="bold"
                    fontSize={18}
                    minWidth={165}
                    textAlign={{
                      xs: "center",
                      sm: "start",
                    }}
                  >
                    New Password:
                  </Box>
                  <input
                    className="set-profile-field"
                    type="password"
                    ref={newPasswordRef}
                    onChange={handleNewPasswordChange}
                    maxLength={30}
                  />
                </Stack>
                {passwordsNotTheSame === true && (
                  <Typography color="error" mb={1} ml={1}>
                    *passwords are not the same
                  </Typography>
                )}
                {/* Confirm new password */}
                <Stack
                  direction={{
                    xs: "column",
                    sm: "row",
                  }}
                  justifyContent="center"
                  alignItems="center"
                  gap={{ xs: "8px", sm: "20px" }}
                >
                  <Box
                    fontWeight="bold"
                    fontSize={18}
                    minWidth={165}
                    textAlign={{
                      xs: "center",
                      sm: "start",
                    }}
                  >
                    Confirm Password:
                  </Box>
                  <input
                    className="set-profile-field"
                    type="password"
                    ref={confirmNewPasswordRef}
                    onChange={handleConfirmPasswordChange}
                    maxLength={30}
                  />
                </Stack>
              </AccordionDetails>
            </Accordion>
          )}

          {/* Grades */}
          <Box className="choose-class-holder">
            <ExpandMoreIcon className="expand-more-icon" />
            <select
              name=""
              className="choose-class"
              id="class"
              value={studentClassId}
              onChange={handleGradeChange}
            >
              {availableGrades.map(
                (grade: { grade_id: number; grade_name: string }) => (
                  <option value={grade.grade_id} key={grade.grade_id}>
                    {grade.grade_name.replace(`Grade `, `Grade - `)}
                  </option>
                )
              )}
            </select>
          </Box>

          {/* Buttons */}
          <Stack
            direction="row"
            justifyContent="center"
            gap={5}
            alignSelf="flex-end"
            mb={{
              xs: "8px",
              sm: "2",
            }}
          >
            <Button
              variant="contained"
              color="secondary"
              sx={{ color: "white", width: "110px" }}
              startIcon={<CancelOutlinedIcon />}
              onClick={closeProfilePopup}
              disabled={loadingEditingProfile}
            >
              Cancel
            </Button>
            <LoadingButton
              variant="contained"
              color="secondary"
              sx={{ color: "white", width: "110px" }}
              startIcon={<ModeEditOutlinedIcon />}
              onClick={handleEditProfile}
              loading={loadingEditingProfile}
            >
              Edit
            </LoadingButton>
          </Stack>
        </Box>
        {ischangeClassWarningOpen && (
          <ConfirmChangeClass
            isOpen={ischangeClassWarningOpen}
            confirmChangeGrade={confirmChangeGrade}
            cancelChangeGrade={cancelChangeGrade}
          />
        )}
      </Stack>
    </Box>
  );
};

type ConfirmChangeClassPropsType = {
  isOpen: boolean;
  confirmChangeGrade: () => void;
  cancelChangeGrade: () => void;
};

const ConfirmChangeClass = (props: ConfirmChangeClassPropsType) => {
  const { isOpen, confirmChangeGrade, cancelChangeGrade } = props;

  return (
    <Dialog
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      open={isOpen}
      onClose={cancelChangeGrade}
    >
      <DialogTitle
        id="dialog-title"
        fontSize="30px"
        textAlign="center"
        color="primary.main"
        mb={2}
      >
        Warning!
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          id="dialog-description"
          color="secondary.main"
          fontWeight="bold"
          fontSize="20px"
          mb={2}
        >
          If you want to change your class. All your grades and your courses
          progress will reset. Which means your assignments , quizzes ,and final
          exams will reset. Are you sure you want to do this?
        </DialogContentText>
      </DialogContent>
      <DialogActions
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: "50px",
          marginBottom: "20px",
        }}
      >
        <Button
          variant="contained"
          color="secondary"
          onClick={cancelChangeGrade}
          sx={{ color: "white" }}
          startIcon={<CancelOutlinedIcon />}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={confirmChangeGrade}
          sx={{ color: "white" }}
          startIcon={<CheckRoundedIcon />}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Profile;
