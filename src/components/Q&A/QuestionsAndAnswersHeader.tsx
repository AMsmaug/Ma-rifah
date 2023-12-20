import {
  Box,
  Toolbar,
  IconButton,
  Typography,
  Stack,
  Menu,
  MenuItem,
} from "@mui/material";

import axios from "axios";

import LogoutIcon from "@mui/icons-material/Logout";

import { useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";

import { ActiveContext } from "../Auth/UserInfo";

import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";

import Cookies from "js-cookie";

type QuestionsAndAnswersHeaderPropsType = {
  handleDrawerToggle: () => void;
  handleOpenSearchPopUp: () => void;
};

export const QuestionsAndAnswersHeader = (
  props: QuestionsAndAnswersHeaderPropsType
) => {
  const { handleDrawerToggle, handleOpenSearchPopUp } = props;

  const [UserName, setUserName] = useState<string>("");
  const [ProfileUrl, setProfileUrl] = useState<string>("");

  // This is for displaying the menu
  const [anchorEl, setanchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const navigate = useNavigate();

  const { userName } = useContext(ActiveContext);

  const navigateHome = () => {
    navigate("/");
  };

  const navigateFAQ = () => {
    navigate("/FAQ");
  };

  const navigateLoginPage = () => {
    navigate("/login?src=QA");
  };

  const navigateToMaterials = () => {
    navigate("/Courses");
  };

  const navigateToProfilePage = () => {
    navigate("/Profile");
  };

  const handleLogout = () => {
    Cookies.remove("id");
    navigate("/login?src=QA");
  };

  const handleOpenMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    setanchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setanchorEl(null);
  };

  useEffect(() => {
    const fetchStudentInfo = async () => {
      const studentId = Cookies.get("id");

      if (studentId !== undefined && userName === "") {
        try {
          const res = await axios.post(
            "http://localhost/Ma-rifah/get_main_student_info.php",
            studentId
          );
          if (res.data.status === "success") {
            const { studentName, avatar } = res.data.message;

            setUserName(studentName);
            setProfileUrl(avatar);
          }
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchStudentInfo();
  }, [userName]);

  return (
    <Toolbar
      sx={{
        position: "fixed",
        left: "0",
        top: "0",
        width: "100%",
        bgcolor: "secondary.main",
        color: "white",
        zIndex: "1300",
        justifyContent: "space-between",
      }}
    >
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={handleDrawerToggle}
        sx={{ mr: 2, display: { sm: "none" } }}
      >
        <MenuIcon />
      </IconButton>
      <Typography variant="h6" noWrap component="div">
        Ma-Rifah
      </Typography>
      <Box
        width={{
          sm: "230px",
          md: "350px",
        }}
        display={{ xs: "none", sm: "block" }}
        overflow="hidden"
      >
        <SearchBar handleClick={handleOpenSearchPopUp} />
      </Box>
      <Stack
        direction="row"
        spacing={{
          xs: 1,
          sm: 2,
          md: 4,
        }}
        className="links"
        alignItems="center"
      >
        <Box
          onClick={handleOpenSearchPopUp}
          sx={{
            cursor: "pointer",
            display: {
              xs: "block",
              sm: "none",
            },
          }}
        >
          <SearchIcon sx={{ margin: "0 !important" }} />
        </Box>
        <Box
          fontWeight="bold"
          onClick={navigateHome}
          sx={{ cursor: "pointer", "&:hover": { color: "primary.main" } }}
        >
          Home
        </Box>
        {Cookies.get("id") !== undefined && (
          <Box
            fontWeight="bold"
            onClick={navigateToMaterials}
            sx={{ cursor: "pointer", "&:hover": { color: "primary.main" } }}
          >
            Materials
          </Box>
        )}

        <Box
          fontWeight="bold"
          onClick={navigateFAQ}
          sx={{ cursor: "pointer", "&:hover": { color: "primary.main" } }}
        >
          FAQ
        </Box>
      </Stack>
      {Cookies.get("id") === undefined ? (
        <Box
          fontWeight="bold"
          onClick={navigateLoginPage}
          color="primary.main"
          sx={{ cursor: "pointer" }}
        >
          Get Started!
        </Box>
      ) : (
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
              onClick={navigateToProfilePage}
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
                    }}
                    src={ProfileUrl}
                  />
                </Box>
                <Typography textTransform="capitalize" fontWeight="bold">
                  {UserName}
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
          <Box
            width={40}
            height={40}
            borderRadius="50%"
            sx={{ backgroundColor: "var(--orange)", cursor: "pointer" }}
            textAlign="center"
            overflow="hidden"
            onClick={handleOpenMenu}
          >
            <img src={ProfileUrl} style={{ width: "100%" }} alt="" />
          </Box>
        </>
      )}
    </Toolbar>
  );
};

const SearchBar = (props: { handleClick: () => void }) => {
  const { handleClick } = props;
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}
      p={1}
      sx={{
        backgroundColor: "white",
        color: "black",
        borderRadius: "25px",
        cursor: "text",
        position: "relative",
        overflow: "visible",
      }}
      className="search-bar"
      onClick={handleClick}
    >
      <SearchIcon sx={{ margin: "0 !important" }} />
      <input
        type="text"
        placeholder="Search for a question"
        style={{ flex: "1" }}
      />
    </Stack>
  );
};
