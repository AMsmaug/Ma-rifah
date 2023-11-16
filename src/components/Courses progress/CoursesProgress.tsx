import "./coursesprogress.css";
import { Box, Stack, Typography, Toolbar, List, ListItem } from "@mui/material";
import { useState, useContext } from "react";
import Footer from "../Footer/Footer";
import { ActiveContext } from "../Auth/SharedData";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const c = [
  {
    courseName: "math",
    courseStatus: "In Progress",
    courseGrade: "10 / 120",
  },
  {
    courseName: "physics",
    courseStatus: "Passed",
    courseGrade: "10 / 120",
  },
  {
    courseName: "biology",
    courseStatus: "In Progress",
    courseGrade: "20 / 120",
  },
  {
    courseName: "chemistry",
    courseStatus: "In Progress",
    courseGrade: "40 / 120",
  },
  {
    courseName: "geography",
    courseStatus: "Failed",
    courseGrade: "50 / 120",
  },
  {
    courseName: "arabic",
    courseStatus: "Passed",
    courseGrade: "100 / 120",
  },
];

const CoursesProgress = () => {
  const [courses] = useState(c);

  const { logout } = useContext(ActiveContext);
  const navigate = useNavigate();

  const handleClick = () => {
    Cookies.remove(`isLoggedIn`);
    Cookies.remove(`id`);
    logout();
    navigate("/login");
  };

  return (
    <Box className="materials">
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
            <span style={{ fontWeight: "bold" }}>Grade:</span> 200/600
          </Box>
          <Box color="primary.main">
            <span style={{ fontWeight: "bold" }}>Average:</span> 12/20
          </Box>
        </Stack>
        <Box sx={{ cursor: "pointer" }} onClick={handleClick}>
          Logout
        </Box>
      </Toolbar>
      <Box className="container" marginTop="100px">
        <Typography
          className="main-title"
          variant="h3"
          sx={{ margin: "0 auto 50px" }}
        >
          Materials
        </Typography>
        <Typography variant="h5" textAlign="center">
          Welcome to
          <Box
            ml="8px"
            mr="8px"
            component="span"
            fontWeight="bold"
            color="primary.main"
            fontSize="30px"
          >
            Ma'rifah
          </Box>
          , where learning knows no bounds!
        </Typography>
        <Box mt="40px">
          <Typography variant="h6" mb={1}>
            Your Grade will be calculated in the following way.
          </Typography>
          <List
            sx={{
              fontSize: { md: "18px" },
              "& li": {
                paddingLeft: "35px",
                position: "relative",
              },
              "& li:before": {
                content: '""',
                position: "absolute",
                left: "5px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: "var(--dark-blue)",
              },
            }}
          >
            <ListItem>10% Assignments</ListItem>
            <ListItem>30% Quizzes</ListItem>
            <ListItem>60% Final Exam </ListItem>
          </List>
        </Box>
        <Stack spacing={2} mt={3} mb={{ xs: 5, md: 8 }}>
          {courses &&
            courses.map((c, i) => (
              <CourseProgress
                key={i}
                courseName={c.courseName}
                courseStatus={c.courseStatus}
                courseGrade={c.courseGrade}
              />
            ))}
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default CoursesProgress;

type courseProgress = {
  courseName: string;
  courseStatus: string;
  courseGrade: string;
};

const CourseProgress = ({
  courseName,
  courseStatus,
  courseGrade,
}: courseProgress) => {
  return (
    <Stack
      className="course-progress"
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      p={{
        xs: 1.5,
        sm: 2,
        md: 3,
      }}
      sx={{
        border: "2px solid var(--dark-blue)",
        borderRadius: "10px",
        cursor: "pointer",
        transition: ".6s",
        "&:hover": {
          backgroundColor: "#ccc",
        },
      }}
      fontSize={{
        xs: "14px",
        md: "20px",
      }}
    >
      <Box
        color="secondary.main"
        fontWeight="bold"
        textTransform="uppercase"
        flexBasis={{
          xs: "90px",
          md: "150px",
        }}
      >
        {courseName}
      </Box>
      <Box
        fontWeight="bold"
        flexBasis={{
          xs: "90px",
          md: "150px",
        }}
        color={
          courseStatus === "Failed"
            ? "error.main"
            : courseStatus === "In Progress"
            ? "primary.main"
            : "success.main"
        }
        textAlign="center"
      >
        {courseStatus}
      </Box>
      <Box fontWeight="bold">{courseGrade}</Box>
    </Stack>
  );
};
