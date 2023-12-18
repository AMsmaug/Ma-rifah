import { Box } from "@mui/material";
import { CoursesHeader } from "../components/Courses progress/CoursesHeader";
import CoursesProgress from "../components/Courses progress/CoursesProgress";

export const Courses = () => {
  return (
    <Box className="materials">
      <CoursesHeader showIcon={false} />
      <CoursesProgress />
    </Box>
  );
};
