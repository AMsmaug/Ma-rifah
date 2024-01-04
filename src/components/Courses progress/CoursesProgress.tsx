import "./courses.css";
import {
  Box,
  Stack,
  Typography,
  List,
  ListItem,
  Skeleton,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import { useContext, useEffect, useState } from "react";
import Footer from "../Footer/Footer";
import { useNavigate } from "react-router-dom";
import { CoursesContext, studentInfoType } from "./CoursesContext";
import axios from "axios";
import Cookies from "js-cookie";
import { CoursesListContext } from "../../App";

const CoursesProgress = () => {
  const { studentInfo, setStudentInfo } = useContext(CoursesContext);

  const { setCourses } = useContext(CoursesListContext);

  const [isLoading, setIsLoading] = useState(true);

  const generateSkeletons = (ngOfSkeletons: number) => {
    const skelet = [];
    for (let i = 0; i < ngOfSkeletons; i++) {
      skelet.push(
        <Skeleton
          key={i}
          animation="wave"
          sx={{
            height: {
              xs: `80px`,
              sm: `80px`,
              md: `140px`,
              lg: `140px`,
            },
            borderRadius: `12px`,
          }}
        />
      );
    }
    return skelet;
  };

  useEffect(() => {
    axios
      .post(`http://localhost/Ma-rifah/get_student_info.php`, Cookies.get(`id`))
      .then((response) => {
        setStudentInfo(response.data);
        setCourses(
          response.data.map((element: studentInfoType) => {
            return element["courseName"];
          })
        );
        setIsLoading(false);
      });
  }, [setCourses, setStudentInfo]);

  return (
    <Box className="materials">
      <Box
        className="container"
        marginTop={{
          xs: "25px",
          sm: "25px",
          md: "50px",
          lg: "50px",
        }}
        padding={`0 15px`}
      >
        <Typography
          className="main-title"
          variant="h3"
          sx={{
            margin: "0 auto 50px",
            fontSize: {
              xs: `30px`,
              sm: `32px`,
              md: `50px`,
              lg: `50px`,
            },
          }}
        >
          Materials
        </Typography>
        <Typography
          variant="h5"
          textAlign="center"
          sx={{
            padding: `0 10px`,
            fontSize: {
              xs: `20px`,
              sm: `20px`,
              md: `32px`,
              lg: `32px`,
            },
          }}
        >
          Welcome to
          <Box
            ml="8px"
            mr="8px"
            component="span"
            fontWeight="bold"
            color="primary.main"
            sx={{
              fontSize: {
                xs: `22px`,
                sm: `22px`,
                md: `34px`,
                lg: `34px`,
              },
            }}
          >
            Ma'rifah
          </Box>
          , where learning knows no bounds!
        </Typography>
        <Box mt="40px">
          <Typography
            variant="h6"
            mb={1}
            sx={{
              fontSize: {
                xs: `18px`,
                sm: `18px`,
                md: `26px`,
                lg: `26px`,
              },
            }}
          >
            Your Grade will be calculated in the following way:
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
            <ListItem>15% Assignments</ListItem>
            <ListItem>35% Quizzes</ListItem>
            <ListItem>50% Final Exam </ListItem>
          </List>
        </Box>
        <Stack spacing={2} mt={3} mb={{ xs: 5, md: 8 }}>
          {isLoading
            ? generateSkeletons(4)
            : studentInfo.map((course) => (
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
        navigate(`${courseName}`, {
          state: {
            fromPage: true,
          },
        });
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
        position={`relative`}
      >
        {courseStatus === "failed" ? (
          <SentimentVeryDissatisfiedIcon
            sx={{
              position: `absolute`,
              left: {
                xs: -2,
                sm: -2,
                md: 10,
                lg: 10,
              },
              top: {
                xs: 2,
                sm: 2,
                md: 3,
                lg: 3,
              },
              fontSize: {
                xs: `18px`,
                sm: `18px`,
                md: `22px`,
                lg: `24px`,
              },
            }}
          />
        ) : courseStatus === "in_progress" ? (
          <SettingsIcon
            sx={{
              fontSize: {
                xs: `16px`,
                sm: `16px`,
                md: `20px`,
                lg: `20px`,
              },
              position: `absolute`,
              left: {
                xs: -20,
                sm: -20,
                md: -15,
                lg: -15,
              },
              top: {
                xs: 3,
                sm: 3,
                md: 5,
                lg: 5,
              },
            }}
            className="settings"
          />
        ) : (
          <SentimentSatisfiedAltIcon
            sx={{
              position: `absolute`,
              left: {
                xs: -10,
                sm: -10,
                md: -2,
                lg: -2,
              },
              top: {
                xs: 2,
                sm: 2,
                md: 3,
                lg: 3,
              },
              fontSize: {
                xs: `18px`,
                sm: `18px`,
                md: `22px`,
                lg: `24px`,
              },
            }}
          />
        )}
        <Typography
          fontWeight="bold"
          fontSize={{
            xs: `14px`,
            sm: `14px`,
            md: `20px`,
            lg: `20px`,
          }}
        >
          {courseStatus
            .replace(`_`, ` `)
            .replace(courseStatus[0], courseStatus[0].toUpperCase())}
        </Typography>
      </Box>
      <Box fontWeight="bold">
        {studentGrade} / {fullMark}
      </Box>
    </Stack>
  );
};
