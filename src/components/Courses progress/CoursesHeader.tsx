import { useContext, useEffect, useState } from "react";
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
} from "@mui/material";
import ReorderIcon from "@mui/icons-material/Reorder";
import { useNavigate } from "react-router-dom";
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
    grade,
    loggedInWithGoogle,
    logout,
  } = useContext(ActiveContext);

  if (profileUrl === "") {
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
          };
        } = response.data;
        console.log(serverResponse);
        setUserName(serverResponse.message.studentName);
        setProfileUrl(serverResponse.message.avatar);
      });
  }

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
    navigate("/login?src=land");
  };

  console.log(studentInfo);

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
      <Box
        fontSize={{ md: "25px", cursor: `pointer` }}
        fontWeight="bold"
        onClick={handleLogoClick}
      >
        Ma'Rifah
      </Box>
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
                  <img
                    style={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    src={profileUrl}
                  />
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
            <img
              src={profileUrl}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              alt=""
            />
          </Box>
        </>
      </Box>
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
