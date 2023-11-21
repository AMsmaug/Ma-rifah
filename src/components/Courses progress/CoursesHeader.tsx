import { useContext } from "react";
import Cookies from "js-cookie";
import { Box, Toolbar } from "@mui/material";
import { Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ActiveContext } from "../Auth/SharedData";
import { CoursesContext } from "./CoursesContext";

export const CoursesHeader = () => {
  const { logout } = useContext(ActiveContext);
  const { studentInfo } = useContext(CoursesContext);
  const navigate = useNavigate();

  let totalGrade = 0;
  let totalMarks = 0;

  const handleClick = () => {
    Cookies.remove(`isLoggedIn`);
    Cookies.remove(`id`);
    logout();
    navigate("/login");
  };

  studentInfo.forEach((student) => {
    totalGrade += +student.studentGrade;
    totalMarks += +student.fullMark;
  });
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
        fontSize: {
          xs: "15px",
          sm: "18px",
          md: "20px",
        },
      }}
    >
      <Box fontSize={{ md: "25px" }} fontWeight="bold">
        Ma'Rifah
      </Box>
      <Stack
        direction="row"
        gap={{
          xs: "7px",
          md: "30px",
        }}
        fontSize={{
          xs: "13px",
          sm: "17px",
          md: "20px",
        }}
        justifyContent="space-between"
        alignItems="center"
      >
        <Box color="primary.main">
          <span style={{ fontWeight: "bold" }}>Grade:</span> {totalGrade}/
          {totalMarks}
        </Box>
        <Box color="primary.main">
          <span style={{ fontWeight: "bold" }}>Average:</span>{" "}
          {((totalGrade * 20) / totalMarks).toFixed(2)}/{20}
        </Box>
      </Stack>
      <Box sx={{ cursor: "pointer" }} onClick={handleClick}>
        Logout
      </Box>
    </Toolbar>
  );
};
