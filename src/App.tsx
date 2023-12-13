import { Route, Routes } from "react-router-dom";
import "./App.css";
import "./normalize.css";
import { Auth } from "./pages/Auth";
import { Landing } from "./pages/Landing";
import { QuestionsAndAnswers } from "./pages/Q&A/QuestionsAndAnswers";
import { UserInfo } from "./components/Auth/UserInfo";
import { createTheme, ThemeProvider } from "@mui/material";
import PickingClassDiscussions from "./components/Picking class discussions/PickingClassDiscussions";
import { RequireAuth } from "./components/Auth/RequireAuth";
import { Material } from "./components/Material/Material";
import { Courses } from "./components/Courses progress/Courses";
import {
  CoursesData,
  studentInfoType,
} from "./components/Courses progress/CoursesContext";
import { PageNotFound } from "./components/wrong url/PageNotFound";
import { useState, createContext, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";

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

type coursesType = {
  courses: string[];
  setCourses: React.Dispatch<React.SetStateAction<string[]>>;
};

// This context has only one job, which is getting the list of courses which the student is enrolled in.
// It cannot be within the userInfo context, because the app component is the root component.
export const CoursesListContext = createContext({} as coursesType);

function App() {
  const [courses, setCourses] = useState<string[]>([]);
  useEffect(() => {
    if (Cookies.get(`id`)) {
      axios
        .post(
          `http://localhost/Ma-rifah/get_student_info.php`,
          Cookies.get(`id`)
        )
        .then((response) => {
          setCourses(
            response.data.map((element: studentInfoType) => {
              return element["courseName"];
            })
          );
        });
    }
  }, [setCourses]);

  return (
    <CoursesListContext.Provider value={{ courses, setCourses }}>
      <UserInfo>
        <CoursesData>
          <ThemeProvider theme={theme}>
            <Routes>
              <Route element={<Landing />} path="/" />
              <Route element={<Auth />} path="login" />
              <Route element={<PickingClassDiscussions />} path="hey" />
              <Route element={<QuestionsAndAnswers />} path="Q&A" />
              <Route
                element={
                  <RequireAuth>
                    <Courses />
                  </RequireAuth>
                }
                path="CoursesProgress"
              />
              {courses
                ? courses.map((course) => (
                    <Route
                      key={course}
                      element={
                        <RequireAuth>
                          <Material />
                        </RequireAuth>
                      }
                      path={`CoursesProgress/${course}`}
                    />
                  ))
                : null}

              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </ThemeProvider>
        </CoursesData>
      </UserInfo>
    </CoursesListContext.Provider>
  );
}

export default App;
