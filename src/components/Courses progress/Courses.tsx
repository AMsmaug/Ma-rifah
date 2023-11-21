import { Box } from "@mui/material";
import { CoursesHeader } from "./CoursesHeader";
import CoursesProgress from "./CoursesProgress";
import { CoursesData } from "./CoursesContext";

export const Courses = () => {
  return (
    <Box className="materials">
      {/* Move the CoursesData component to app.tsx (search for route children) */}
      <CoursesData>
        <CoursesHeader />
        <CoursesProgress />
      </CoursesData>
    </Box>
  );
};
