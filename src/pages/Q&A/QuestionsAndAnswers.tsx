import { useState, useRef, useContext } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import SideBar from "../../components/Side Bar/SideBar";
import SearchIcon from "@mui/icons-material/Search";
import "./q&a.css";
import { useNavigate } from "react-router-dom";
import { Avatar, Button, Divider, Paper, Rating } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { ActiveContext } from "../../components/Auth/UserInfo";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import NoContentFound from "../../components/No Content found/NoContentFound";
import LoadingIndicator from "../../components/Loading Indicator/LoadingIndicator";

export const QuestionsAndAnswers = () => {
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [noContentFound, setnoContentFound] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navigateHome = () => {
    navigate("/");
  };

  const navigateLoginPage = () => {
    navigate("/login");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "") {
      setisLoading(false);
      setnoContentFound(false);
      return;
    }
    setisLoading(true);
    setTimeout(() => {
      setnoContentFound(true);
      setisLoading(false);
    }, 2000);
  };

  return (
    <Box sx={{ display: "flex" }} className="questions-page">
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
            sm: "220px",
            md: "500px",
            lg: "700px",
          }}
          display={{ xs: "none", sm: "block" }}
        >
          <SearchBar handleChange={handleChange} />
        </Box>
        <Stack direction="row" spacing={2} className="links">
          <Box
            fontWeight="bold"
            onClick={navigateHome}
            sx={{ cursor: "pointer", "&:hover": { color: "primary.main" } }}
          >
            Home
          </Box>
          <Box
            fontWeight="bold"
            onClick={() => navigate(-1)}
            sx={{ cursor: "pointer", "&:hover": { color: "primary.main" } }}
          >
            Classes
          </Box>
        </Stack>
        <Box
          fontWeight="bold"
          onClick={navigateLoginPage}
          color="primary.main"
          sx={{ cursor: "pointer" }}
        >
          Get Started!
        </Box>
      </Toolbar>
      <SideBar
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: {
            xs: 1,
            md: 3,
          },
        }}
        className="questions-content"
      >
        <Toolbar />
        <Box mb={2} display={{ xs: "block", sm: "none" }}>
          <SearchBar handleChange={handleChange} />
        </Box>
        <Box>
          <Typography
            variant="h2"
            color="secondary.main"
            className="main-title"
            sx={{ margin: "10px auto 40px" }}
          >
            Math
          </Typography>
          <Typography variant="h4" color="primary.main" fontWeight="bold">
            Chapter 1: Functions
          </Typography>
          <Stack className="questions-wrapper" mt={2} spacing={2}>
            {isLoading ? (
              <LoadingIndicator />
            ) : noContentFound ? (
              <NoContentFound />
            ) : (
              <Question />
            )}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default QuestionsAndAnswers;

type SearchBar = {
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const SearchBar = ({ handleChange }: SearchBar) => {
  const inputRef = useRef<HTMLInputElement>(null!);
  const handleClick = () => {
    inputRef.current.focus();
  };
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
        overflow: "hidden",
      }}
      className="search-bar"
      onClick={handleClick}
    >
      <SearchIcon />
      <input
        ref={inputRef}
        type="text"
        placeholder="Search for a question"
        style={{ flex: "1" }}
        onChange={handleChange}
      />
    </Stack>
  );
};

const Question = () => {
  const { isLoggedIn } = useContext(ActiveContext);
  const [isPopUpOpened, setisPopUpOpened] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleClick = () => {
    if (!isLoggedIn) {
      setisPopUpOpened(true);
    }
  };
  const handleClose = () => {
    setisPopUpOpened(false);
  };
  return (
    <>
      {isPopUpOpened && (
        <Dialog
          aria-labelledby="dialog-title"
          aria-describedby="dialog-description"
          open={isPopUpOpened}
          onClose={handleClose}
        >
          <DialogTitle
            id="dialog-title"
            fontSize="30px"
            textAlign="center"
            color="primary.main"
            mb={2}
          >
            Notice!
          </DialogTitle>
          <DialogContent>
            <DialogContentText
              id="dialog-description"
              color="secondary.main"
              fontWeight="bold"
              fontSize="20px"
              mb={2}
            >
              You must login in order to add an answer!
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
              onClick={handleClose}
              sx={{ color: "white" }}
            >
              Later
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => navigate("/login")}
              sx={{ color: "white" }}
            >
              Log in
            </Button>
          </DialogActions>
        </Dialog>
      )}
      <Paper
        className="question"
        sx={{
          padding: {
            xs: "15px",
            sm: "8px",
            md: "15px",
          },
        }}
      >
        <Stack spacing={2}>
          <Stack spacing={1} direction="row" alignItems="center">
            <Avatar src="../../../public/images/av1.png" />
            <Typography variant="h6" fontWeight="bold">
              Abdallah Al Korhani
            </Typography>
          </Stack>
          <Typography variant="subtitle1">
            How can I solve this problem ?
          </Typography>
          <Box
            height="300px"
            textAlign={{
              xs: "center",
              md: "start",
            }}
            overflow="hidden"
            width={{ xs: "350px", sm: "300px", md: "500px", lg: "700px" }}
            alignSelf={{ xs: "center", lg: "start" }}
          >
            <img
              className="question-image"
              src="../../../public/images/qu.jpg"
              alt=""
              width="100%"
              height="300px"
              style={{ objectFit: "contain" }}
            />
          </Box>
          <Box className="answers" mt={1}>
            <Typography variant="h5" mb={2} color="primary.main">
              3 Answers:
            </Typography>
            <Stack
              spacing={2}
              className="answers-wrapper"
              divider={<Divider />}
            >
              <Stack spacing={1}>
                <Stack spacing={1} direction="row" alignItems="center">
                  <Avatar src="../../../public/images/av3.png" />
                  <Typography variant="h6" fontWeight="bold">
                    Adam Kalasina
                  </Typography>
                </Stack>
                <Stack
                  spacing={1}
                  direction={{
                    xs: "column",
                    md: "row",
                  }}
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="subtitle1" pl={2} flexBasis="80%">
                    Replace x with infinity you dumb
                  </Typography>
                  <Stack spacing={1}>
                    <Rating size="large" />
                  </Stack>
                </Stack>
              </Stack>

              <Stack spacing={1}>
                <Stack spacing={1} direction="row" alignItems="center">
                  <Avatar src="../../../public/images/av3.png" />
                  <Typography variant="h6" fontWeight="bold">
                    Ammar Malas
                  </Typography>
                </Stack>
                <Stack
                  spacing={1}
                  direction={{
                    xs: "column",
                    md: "row",
                  }}
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="subtitle1" pl={2} flexBasis="80%">
                    That is the most stupid question I've ever seen -.-
                  </Typography>
                  <Stack spacing={1}>
                    <Rating size="large" />
                  </Stack>
                </Stack>
              </Stack>
              <Stack spacing={1}>
                <Stack spacing={1} direction="row" alignItems="center">
                  <Avatar src="../../../public/images/av4.png" />
                  <Typography variant="h6" fontWeight="bold">
                    Mohamad Kraytem lnerd
                  </Typography>
                </Stack>
                <Stack
                  spacing={1}
                  direction={{
                    xs: "column",
                    md: "row",
                  }}
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="subtitle1" pl={2} flexBasis="80%">
                    Ohh that's a very good question. In the first part, you
                    should replace x with + infinity and you will get inifnity +
                    2 over 5 . Infinity over a constant is infinity. So the
                    result is + infinity. <br />
                    In the second part, you should do the same thing but instead
                    of replacing + infinity you should replace - infinity
                  </Typography>
                  <Stack spacing={1}>
                    <Rating size="large" />
                  </Stack>
                </Stack>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <textarea
                  placeholder="Add an answer..."
                  className="add-answer-input"
                  rows={4}
                />
                <IconButton
                  sx={{
                    color: "primary.main",
                    fontWeight: "bold",
                    transition: ".6s",
                    width: "45px",
                    height: "45px",
                    backgroundColor: "#ddd",
                    "&:hover": {
                      bgcolor: "secondary.main",
                    },
                  }}
                  onClick={handleClick}
                >
                  <SendIcon sx={{ fontSize: "25px", fontWeight: "bold" }} />
                </IconButton>
              </Stack>

              <Button
                variant="contained"
                color="primary"
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  marginTop: "20px",
                  width: "150px",
                  alignSelf: {
                    xs: "center",
                    md: "start",
                  },
                }}
              >
                View More
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </>
  );
};
