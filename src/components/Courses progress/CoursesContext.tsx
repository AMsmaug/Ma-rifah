import { createContext, useState } from "react";

export type studentInfoType = {
  courseId: number;
  courseName: string;
  fullMark: number;
  studentGrade: number;
  courseStatus: "in_progress" | "success" | "failed";
};

type contextType = {
  studentInfo: studentInfoType[];
  setStudentInfo: React.Dispatch<React.SetStateAction<studentInfoType[]>>;
  currentCourseId: number;
  setCurrentCourseId: React.Dispatch<React.SetStateAction<number>>;
};

export const CoursesContext = createContext({} as contextType);

export const CoursesData = ({ children }: { children: React.ReactNode }) => {
  const [studentInfo, setStudentInfo] = useState<studentInfoType[]>([]);
  const [currentCourseId, setCurrentCourseId] = useState(0);

  return (
    <CoursesContext.Provider
      value={{
        studentInfo,
        setStudentInfo,
        currentCourseId,
        setCurrentCourseId,
      }}
    >
      {children}
    </CoursesContext.Provider>
  );
};
