import { useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Box, Toolbar, IconButton, Stack, Drawer } from "@mui/material";
import ReorderIcon from "@mui/icons-material/Reorder";
import { useNavigate } from "react-router-dom";
import { CoursesContext } from "./CoursesContext";
import { DrawerContent } from "../Material/DrawerContent";

export const CoursesHeader = ({ showIcon }: { showIcon: boolean }) => {
  const { studentInfo, studentGrade, setStudentGrade } =
    useContext(CoursesContext);
  const [openDrawer, setOpenDrawer] = useState(false);
  const navigate = useNavigate();

  let totalGrade = 0;
  let totalMarks = 0;

  const handleClick = () => {
    Cookies.remove(`id`);
    navigate("/login?src=land");
  };

  const handleLogoClick = () => {
    navigate(`/`);
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
      <Box sx={{ cursor: "pointer" }} onClick={handleClick}>
        Logout
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
