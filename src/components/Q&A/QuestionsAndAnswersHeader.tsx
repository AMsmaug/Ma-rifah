import { Box, Toolbar, IconButton, Typography, Stack } from "@mui/material";

import { useNavigate } from "react-router-dom";

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

  const navigate = useNavigate();

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
    navigate("/CoursesProgress");
  };

  const handleLogout = () => {
    Cookies.remove("id");
    navigate("/login?src=QA");
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
        <Box
          fontWeight="bold"
          onClick={handleLogout}
          color="primary.main"
          sx={{ cursor: "pointer" }}
        >
          Log out!
        </Box>
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
