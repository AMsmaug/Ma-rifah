import "./coursesprogress.css";
import { Box, Stack, Typography, List, ListItem } from "@mui/material";
import { useContext, useEffect } from "react";
import Footer from "../Footer/Footer";
import { useNavigate } from "react-router-dom";
import { CoursesContext } from "./CoursesContext";
import axios from "axios";
import Cookies from "js-cookie";

const CoursesProgress = () => {
  const { studentInfo, setStudentInfo } = useContext(CoursesContext);

  console.log(Cookies.get("id"));

  useEffect(() => {
    axios
      .post(`http://localhost/Ma-rifah/get_student_info.php`, Cookies.get(`id`))
      .then((response) => {
        setStudentInfo(response.data);
      });
  }, [setStudentInfo]);

  return (
    <Box className="materials">
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
          {studentInfo.map((course) => (
            <CourseProgress
              key={course.courseId}
              courseId={course.courseId}
              courseName={course.courseName}
              courseStatus={course.courseStatus}
              studentGrade={course.studentGrade}
              fullMark={course.fullMark}
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
  courseId: number;
  courseName: string;
  courseStatus: string;
  studentGrade: number;
  fullMark: number;
};

const CourseProgress = ({
  courseId,
  courseName,
  courseStatus,
  studentGrade,
  fullMark,
}: courseProgress) => {
  const { setCurrentCourseId } = useContext(CoursesContext);
  const navigate = useNavigate();
  return (
    <Stack
      className="course-progress"
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      onClick={() => {
        setCurrentCourseId(courseId);
        navigate(`${courseName}`);
      }}
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
          courseStatus === "failed"
            ? "error.main"
            : courseStatus === "in_progress"
            ? "primary.main"
            : "success.main"
        }
        textAlign="center"
      >
        {courseStatus
          .replace(`_`, ` `)
          .replace(courseStatus[0], courseStatus[0].toUpperCase())}
      </Box>
      <Box fontWeight="bold">
        {studentGrade} / {fullMark}
      </Box>
    </Stack>
  );
};
