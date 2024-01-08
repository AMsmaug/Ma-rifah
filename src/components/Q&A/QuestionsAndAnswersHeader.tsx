import {
  Box,
  Toolbar,
  IconButton,
  Typography,
  Stack,
  Menu,
  MenuItem,
  Alert,
  AlertProps,
  Snackbar,
} from "@mui/material";

import LogoutIcon from "@mui/icons-material/Logout";

import { useNavigate } from "react-router-dom";
import { useState, useContext, forwardRef } from "react";

import { ActiveContext } from "../Auth/UserInfo";

import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";

import Cookies from "js-cookie";

import { Profile } from "../Profile/Profile";

type QuestionsAndAnswersHeaderPropsType = {
  handleDrawerToggle: () => void;
  handleOpenSearchPopUp: () => void;
};

export const QuestionsAndAnswersHeader = (
  props: QuestionsAndAnswersHeaderPropsType
) => {
  const { handleDrawerToggle, handleOpenSearchPopUp } = props;

  const [isProfilePopUpOpen, setisProfilePopUpOpen] = useState<boolean>(false);

  // This is for displaying the menu
  const [anchorEl, setanchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

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

  const handleLogout = () => {
    Cookies.remove("id");
    logout();
    navigate("/login?src=QA");
  };

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
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={handleDrawerToggle}
        sx={{ mr: 2, display: { sm: "none" } }}
      >
        <MenuIcon />
      </IconButton>
      <Stack
        direction="row"
        alignItems="center"
        gap={0}
        sx={{ cursor: "pointer" }}
        onClick={() => navigate("/")}
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
      )}
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

const SnackbarAlert = forwardRef<HTMLDivElement, AlertProps>(
  function SnackBarAlert(props, ref) {
    return <Alert elevation={6} ref={ref} {...props} />;
  }
);
