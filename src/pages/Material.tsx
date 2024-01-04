import { Box } from "@mui/material";
import { CoursesHeader } from "../components/Courses progress/CoursesHeader";
import { SideBar } from "../components/Material/SideBar";
import { useContext, useEffect } from "react";
import axios from "axios";
import { CoursesContext } from "../components/Courses progress/CoursesContext";
import Cookies from "js-cookie";
import { Stack } from "@mui/material";
import { MaterialContent } from "../components/Material/MaterialContent";
import { Advertisment } from "../components/Material/Advertisment";

export const Material = () => {
  const { studentInfo, setStudentInfo } = useContext(CoursesContext);
  useEffect(() => {
    if (JSON.stringify(studentInfo) === JSON.stringify([])) {
      axios
        .post(
          `http://localhost/Ma-rifah/get_student_info.php`,
          Cookies.get(`id`)
        )
        .then((response) => {
          setStudentInfo(response.data);
        });
    }
  }, [studentInfo, setStudentInfo]);
  return (
    <Box>
      <CoursesHeader showIcon={true} />
      <Stack direction={`row`}>
        <SideBar />
        <MaterialContent />
        <Advertisment formQuestionAndAnswers={false} />
      </Stack>
    </Box>
  );
};
