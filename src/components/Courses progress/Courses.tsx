import { Box } from "@mui/material";
import { CoursesHeader } from "./CoursesHeader";
import CoursesProgress from "./CoursesProgress";

export const Courses = () => {
  return (
    <Box className="materials">
      <CoursesHeader />
      <CoursesProgress />
    </Box>
  );
};
