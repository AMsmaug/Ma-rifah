import { useContext, useState } from "react";
import Cookies from "js-cookie";
import { Box, Toolbar, IconButton, Stack, Drawer } from "@mui/material";
import ReorderIcon from "@mui/icons-material/Reorder";
import { useNavigate } from "react-router-dom";
import { CoursesContext } from "./CoursesContext";
import { DrawerContent } from "../Material/DrawerContent";

export const CoursesHeader = () => {
  const { studentInfo } = useContext(CoursesContext);
  const [openDrawer, setOpenDrawer] = useState(false);
  const navigate = useNavigate();

  console.log(studentInfo);

  let totalGrade = 0;
  let totalMarks = 0;

  const handleClick = () => {
    Cookies.remove(`isLoggedIn`);
    Cookies.remove(`id`);
    navigate("/login");
  };

  const handleLogoClick = () => {
    navigate(`/`);
  };

  studentInfo.forEach((student) => {
    totalGrade += +student.studentGrade;
    totalMarks += +student.fullMark;
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
    </Toolbar>
  );
};
