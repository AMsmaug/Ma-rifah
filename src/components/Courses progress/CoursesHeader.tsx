import { forwardRef, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import {
  Box,
  Toolbar,
  IconButton,
  Stack,
  Drawer,
  Menu,
  MenuItem,
  Typography,
  Alert,
} from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import { AlertProps } from "@mui/material/Alert";
import ReorderIcon from "@mui/icons-material/Reorder";
import { Link, useNavigate } from "react-router-dom";
import { CoursesContext } from "./CoursesContext";
import { DrawerContent } from "../Material/DrawerContent";
import LogoutIcon from "@mui/icons-material/Logout";
import { ActiveContext } from "../Auth/UserInfo";
import Profile from "../Profile/Profile";
import axios from "axios";

export const CoursesHeader = ({ showIcon }: { showIcon: boolean }) => {
  const { studentInfo, studentGrade, setStudentGrade } =
    useContext(CoursesContext);
  const [openDrawer, setOpenDrawer] = useState(false);
  const navigate = useNavigate();

  const {
    userName,
    setUserName,
    profileUrl,
    setProfileUrl,
    setgrade,
    grade,
    loggedInWithGoogle,
    logout,
    setloggedInWithGoogle,
  } = useContext(ActiveContext);

  console.log(profileUrl, userName);

  useEffect(() => {
    if (profileUrl === "" || profileUrl === null) {
      console.log(`true from courses header`);
      axios
        .post(
          "http://localhost/Ma-rifah/get_main_student_info.php",
          Cookies.get("id")
        )
        .then((response) => {
          const serverResponse: {
            status: string;
            message: {
              studentName: string;
              avatar: string;
              class_id: number;
              loggedInWithGoogle: boolean;
            };
          } = response.data;
          console.log(serverResponse);
          setUserName(serverResponse.message.studentName);
          setProfileUrl(serverResponse.message.avatar);
          setgrade(serverResponse.message.class_id);
          setloggedInWithGoogle(serverResponse.message.loggedInWithGoogle);
        });
    }
  }, [
    grade,
    profileUrl,
    setProfileUrl,
    setUserName,
    setgrade,
    setloggedInWithGoogle,
  ]);

  let totalGrade = 0;
  let totalMarks = 0;

  const handleLogoClick = () => {
    navigate("/");
  };

  const [isProfilePopUpOpen, setisProfilePopUpOpen] = useState<boolean>(false);

  // This is for displaying the menu
  const [anchorEl, setanchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleOpenMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    setanchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setanchorEl(null);
  };

  const openProfilePopup = () => {
    setisProfilePopUpOpen(true);
    setanchorEl(null);
  };

  const handleLogout = () => {
    Cookies.remove("id");
    logout();
    navigate("/login?src=land");
  };

  // console.log(studentInfo);

  if (Array.isArray(studentInfo))
    studentInfo.forEach((student) => {
      totalGrade += +student.studentGrade;
      totalMarks += +student.fullMark;
    });

  useEffect(() => {
    if (totalGrade !== 0) {
      setStudentGrade(totalGrade);
    }
  });

  const [openSnackBar, setOpenSnackBar] = useState(false);

  const handleSnackBarClick = () => {
    setOpenSnackBar(true);
  };

  const handleSnackBarClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setOpenSnackBar(false);
  };

  return (
    <Toolbar
      sx={{
        position: "sticky",
        left: "0",
        top: "0",
        width: "100%",
        bgcolor: "secondary.main",
        color: "white",
        zIndex: "1300",
        justifyContent: "space-between",
        fontSize: {
          xs: "15px",
          sm: "18px",
          md: "20px",
        },
      }}
    >
      <Snackbar
        open={openSnackBar}
        autoHideDuration={6000}
        onClose={handleSnackBarClose}
        anchorOrigin={{
          vertical: `bottom`,
          horizontal: `right`,
        }}
      >
        <SnackbarAlert severity="success" onClose={handleSnackBarClose}>
          Profile edited successfully!
        </SnackbarAlert>
      </Snackbar>
      <Stack
        direction="row"
        alignItems="center"
        gap={0}
        sx={{ cursor: "pointer" }}
        onClick={handleLogoClick}
      >
        <Box
          sx={{
            height: "64px",
            width: "85px",
            overflow: "hidden",
            objectFit: "contain",
          }}
        >
          <img
            src="../../../public/images/mmmlogo.png"
            width="100%"
            height="64px"
          />
        </Box>
        <Typography
          variant="h5"
          sx={{
            display: {
              xs: "none",
              sm: "block",
            },
            margin: "0",
            color: "white",
            fontWeight: "bold",
            fontSize: "25px",
          }}
        >
          Ma'rifah
        </Typography>
      </Stack>
      <Box
        position={`absolute`}
        top={`50%`}
        sx={{
          transform: `translateY(-50%)`,
          left: { xs: `82px`, sm: `105px` },
          display: {
            xs: `block`,
            sm: `block`,
            md: `none`,
            lg: `none`,
          },
        }}
      >
        {showIcon ? (
          <IconButton
            aria-label="send"
            sx={{ color: `white` }}
            size="small"
            onClick={() => setOpenDrawer(true)}
          >
            <ReorderIcon
              sx={{
                fontSize: {
                  xs: `22px`,
                  sm: `26px`,
                },
              }}
            />
          </IconButton>
        ) : null}
      </Box>
      <Stack
        direction="row"
        gap={{
          xs: "7px",
          md: "30px",
        }}
        fontSize={{
          xs: "14px",
          sm: "17px",
          md: "20px",
        }}
        justifyContent="space-between"
        alignItems="center"
      >
        <Box color="primary.main">
          <span style={{ fontWeight: "bold" }}>Grade:</span>{" "}
          {Math.round(studentGrade)}/{totalMarks}
        </Box>
        <Box color="primary.main">
          <span style={{ fontWeight: "bold" }}>Average:</span>{" "}
          {(totalMarks === 0 ? 0 : (studentGrade * 20) / totalMarks).toFixed(2)}
          /{20}
        </Box>
      </Stack>
      <Stack direction={`row`} alignItems={`center`} position={`relative`}>
        <Typography
          fontSize={`18px`}
          sx={{
            cursor: `pointer`,
            display: {
              xs: `none`,
              sm: `none`,
              md: `block`,
              lg: `block`,
            },
            position: `absolute`,
            top: `50%`,
            transform: `translateY(-50%)`,
            left: {
              lg: `-180px`,
              md: `-60px`,
            },
            transition: `0.3s`,
            "&:hover": {
              color: `#fca311`,
            },
          }}
        >
          <Link
            to={`/Q&A`}
            style={{ color: `inherit`, textDecoration: `none` }}
          >
            Q&A
          </Link>
        </Typography>
        <Typography
          fontSize={`18px`}
          sx={{
            cursor: `pointer`,
            display: {
              xs: `none`,
              sm: `none`,
              md: `block`,
              lg: `block`,
            },
            position: `absolute`,
            top: `50%`,
            transform: `translateY(-50%)`,
            left: {
              lg: `-250px`,
              md: `-120px`,
            },
            transition: `0.3s`,
            "&:hover": {
              color: `#fca311`,
            },
          }}
        >
          <Link
            to={`/FAQ`}
            style={{ color: `inherit`, textDecoration: `none` }}
          >
            FAQ
          </Link>
        </Typography>
        <Box sx={{ cursor: "pointer" }}>
          <>
            <Menu
              id="question-menu"
              anchorEl={anchorEl}
              open={open}
              MenuListProps={{
                "aria-labelledby": "question-menu-button",
              }}
              onClose={handleCloseMenu}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              sx={{
                "& .MuiPaper-root": {
                  top: "58px !important",

                  padding: "10px",
                },
                "& li": {
                  width: "300px",
                  transition: ".4s",
                },
                "& li:hover": {
                  backgroundColor: "#ccc",
                },
              }}
            >
              <MenuItem
                sx={{
                  fontWeight: "bold",
                  cursor: "pointer",
                  display: "flex",
                  marginBottom: "5px",
                  borderRadius: "6px",
                }}
                onClick={openProfilePopup}
              >
                <Stack direction="row" alignItems="center">
                  <Box
                    width="35px"
                    height="35px"
                    borderRadius="50%"
                    overflow="hidden"
                    marginRight="15px"
                  >
                    {profileUrl !== null ? (
                      <img
                        src={profileUrl}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        alt=""
                      />
                    ) : (
                      <Stack
                        width="100%"
                        height="100%"
                        justifyContent="center"
                        alignItems="center"
                        fontSize={20}
                        bgcolor="secondary.main"
                        color="white"
                      >
                        {userName[0]?.toUpperCase()}
                      </Stack>
                    )}
                  </Box>
                  <Typography textTransform="capitalize" fontWeight="bold">
                    {userName}
                  </Typography>
                </Stack>
              </MenuItem>
              <MenuItem
                onClick={handleLogout}
                sx={{
                  fontWeight: "bold",
                  cursor: "pointer",
                  borderRadius: "6px",
                }}
              >
                <LogoutIcon
                  sx={{
                    width: "35px",
                    marginRight: "15px",
                  }}
                />
                Log out
              </MenuItem>
            </Menu>
            {isProfilePopUpOpen && (
              <Profile
                profilePictureUrl={profileUrl}
                setprofilePicture={setProfileUrl}
                name={userName}
                setname={setUserName}
                grade={grade}
                closeProfilePopup={() => setisProfilePopUpOpen(false)}
                loggedInWithGoogle={loggedInWithGoogle}
                logout={logout}
                handleSnackBarClick={handleSnackBarClick}
              />
            )}
            <Box
              width={40}
              height={40}
              borderRadius="50%"
              sx={{ backgroundColor: "var(--orange)", cursor: "pointer" }}
              textAlign="center"
              overflow="hidden"
              onClick={handleOpenMenu}
            >
              {profileUrl !== null ? (
                <img
                  src={profileUrl}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  alt=""
                />
              ) : (
                <Stack
                  width="100%"
                  height="100%"
                  justifyContent="center"
                  alignItems="center"
                  fontSize={20}
                >
                  {userName[0]?.toUpperCase()}
                </Stack>
              )}
            </Box>
          </>
        </Box>
      </Stack>
      {showIcon ? (
        <Drawer
          anchor="left"
          open={openDrawer}
          onClose={() => setOpenDrawer(false)}
          sx={{
            display: {
              sm: `block`,
              md: `none`,
            },
          }}
        >
          <Box
            sx={{
              width: {
                xs: `250px`,
                sm: `300px`,
              },
            }}
            textAlign={`center`}
            role="presentation"
          >
            <DrawerContent />
          </Box>
        </Drawer>
      ) : null}
    </Toolbar>
  );
};

const SnackbarAlert = forwardRef<HTMLDivElement, AlertProps>(
  function SnackBarAlert(props, ref) {
    return <Alert elevation={6} ref={ref} {...props} />;
  }
);
