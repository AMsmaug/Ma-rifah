import { Route, Routes } from "react-router-dom";
import "./App.css";
import "./normalize.css";
import { Auth } from "./pages/Auth";
import { Landing } from "./pages/Landing";
import { QuestionsAndAnswers } from "./pages/Q&A/QuestionsAndAnswers";
import { SharedData } from "./components/Auth/SharedData";
import { createTheme, ThemeProvider } from "@mui/material";
import PickingClassDiscussions from "./components/Picking class discussions/PickingClassDiscussions";
import { RequireAuth } from "./components/Auth/RequireAuth";
import { Material } from "./components/Material/Material";
import { Courses } from "./components/Courses progress/Courses";

const theme = createTheme({
  palette: {
    primary: {
      main: "#fca311",
      dark: "#c67d07",
    },
    secondary: {
      main: "#13213c",
    },
    gray: {
      main: "#e5e5e5",
    },
  },
});

function App() {
  return (
    <SharedData>
      <ThemeProvider theme={theme}>
        <Routes>
          <Route element={<Landing />} path="/" />
          <Route element={<Auth />} path="/login" />
          <Route element={<PickingClassDiscussions />} path="/hey" />
          <Route element={<QuestionsAndAnswers />} path="/Q&A" />
          <Route
            element={
              <RequireAuth>
                <Courses />
              </RequireAuth>
            }
            path="/CoursesProgress"
          />
          <Route
            element={
              <RequireAuth>
                <Material />
              </RequireAuth>
            }
            path="/CoursesProgress/:courseName"
          />
        </Routes>
      </ThemeProvider>
    </SharedData>
  );
}

export default App;
