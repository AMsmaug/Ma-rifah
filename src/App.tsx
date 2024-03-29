import { Route, Routes } from "react-router-dom";
import "./App.css";
import "./normalize.css";
import { Auth } from "./pages/Auth";
import { Landing } from "./pages/Landing";
import { QuestionsAndAnswers } from "./pages/QuestionsAndAnswers";
import { UserInfo } from "./components/Auth/UserInfo";
import { Box, createTheme, ThemeProvider } from "@mui/material";
import PickingClassDiscussions from "./pages/PickingClassDiscussions";
import { RequireAuth } from "./components/Auth/RequireAuth";
import { Material } from "./pages/Material";
import { Courses } from "./pages/Courses";
import {
  CoursesData,
  studentInfoType,
} from "./components/Courses progress/CoursesContext";
import { useState, createContext, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import NoContentFound from "./components/No Content found/NoContentFound";
import { Assignment } from "./pages/Assignment";
import React from "react";
import { Quiz } from "./pages/Quiz";
import FinalExam from "./components/Final Exam/FinalExam";
import Faq from "./pages/FAQ/FAQ";
import ProfilePage from "./pages/ProfilePage";

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
      <CoursesData>
        <UserInfo>
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
                path="Courses"
              />
              {courses
                ? courses.map((course) => (
                    <React.Fragment key={course}>
                      <Route
                        element={
                          <RequireAuth>
                            <Material />
                          </RequireAuth>
                        }
                        path={`Courses/${course}`}
                      />
                      <Route
                        path={`Courses/${course}/Assignment`}
                        element={<Assignment />}
                      />
                      <Route
                        path={`Courses/${course}/Quiz`}
                        element={<Quiz />}
                      />
                    </React.Fragment>
                  ))
                : null}

              <Route
                path="*"
                element={
                  <Box mt={3}>
                    <NoContentFound
                      iconFontSize={120}
                      iconColor="primary.main"
                      textFontSize={26}
                      seperateString={false}
                    />
                  </Box>
                }
              />
              <Route element={<FinalExam />} path="finalExam" />
              <Route element={<Faq />} path="FAQ" />
              <Route element={<ProfilePage />} path="Profile" />
            </Routes>
          </ThemeProvider>
        </UserInfo>
      </CoursesData>
    </CoursesListContext.Provider>
  );
}

export default App;
