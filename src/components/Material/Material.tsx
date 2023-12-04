import { Box } from "@mui/material";
import { CoursesHeader } from "../Courses progress/CoursesHeader";
import { SideBar } from "./SideBar";
import { useContext, useEffect } from "react";
import axios from "axios";
import { CoursesContext } from "../Courses progress/CoursesContext";
import Cookies from "js-cookie";
import { Stack } from "@mui/material";
import { MaterialContent } from "./MaterialContent";
import { Advertisment } from "./Advertisment";

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
      <CoursesHeader />
      <Stack direction={`row`}>
        <SideBar />
        <MaterialContent />
        <Advertisment />
      </Stack>
    </Box>
  );
};
