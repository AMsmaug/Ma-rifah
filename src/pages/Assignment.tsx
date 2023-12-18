import { useContext, useEffect, useState } from "react";
import { AssignmentWork } from "../components/Assignment/AssignmentWork";
import { CoursesContext } from "../components/Courses progress/CoursesContext";
import axios from "axios";
import Cookies from "js-cookie";
import { AssignmentResult } from "../components/Assignment/AssignmentResult";
import { Typography } from "@mui/material";
import { useLocation } from "react-router-dom";

export type resultType = {
  problemId: number;
  problemParagraph: string;
  problemQuestion: string;
  possibilities: {
    possId: number;
    possSentence: string;
    isCorrect: boolean;
    isChecked: boolean;
  }[];
};

export const Assignment = () => {
  const { currentChapterId } = useContext(CoursesContext);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [assignmentId, setAssignmentId] = useState(0);
  const [nbOfProblems, setNbOfProblems] = useState(0);
  const [result, setResult] = useState([] as resultType[]);
  const [grade, setGrade] = useState(0);

  useEffect(() => {
    if (currentChapterId !== 0) {
      console.log(currentChapterId);
      axios
        .post(
          `http://localhost/Ma-rifah/Assignment/get_assignment_data.php`,
          currentChapterId
        )
        .then(
          (response: {
            data: {
              assignmentId: number;
              chapterId: number;
              numberOfProblems: number;
            };
          }) => {
            console.log(response.data.assignmentId);
            setAssignmentId(response.data.assignmentId);
            setNbOfProblems(response.data.numberOfProblems);
            sessionStorage.setItem(
              `assignmentId`,
              `${response.data.assignmentId}`
            );
            sessionStorage.setItem(
              `nbOfProblems`,
              `${response.data.numberOfProblems}`
            );
          }
        );
    }
    // checking if the user has submitted the assignment
    if (assignmentId !== 0 || sessionStorage.getItem(`assignmentId`))
      axios
        .post(`http://localhost/Ma-rifah/Assignment/get_results.php`, {
          assignmentId: sessionStorage.getItem(`assignmentId`)
            ? sessionStorage.getItem(`assignmentId`)
            : assignmentId,
          studentId: Cookies.get(`id`),
        })
        .then(
          (response: {
            data: { status: string; grade: number; payload: resultType[] };
          }) => {
            console.log(response.data);
            if (response.data.status === `success`) {
              setIsSubmitted(true);
              setResult(response.data.payload);
              setGrade(response.data.grade);
            } else {
              setIsSubmitted(false);
            }
          }
        );
  }, [assignmentId, currentChapterId, isSubmitted]);

  const location = useLocation();
  const chapterTitle = location.state;
  return (
    <>
      <Typography
        variant="h1"
        component={`h3`}
        fontSize={{
          xs: `22px`,
          sm: `28px`,
          md: `30px`,
          lg: `30px`,
        }}
        m={`20px auto 70px`}
        className="main-title"
        textTransform={`capitalize`}
      >
        chapter {chapterTitle.number}: {chapterTitle.name}
      </Typography>
      {!isSubmitted ? (
        <AssignmentWork
          assignmentData={{
            assignmentId: sessionStorage.getItem(`assignmentId`)
              ? parseInt(sessionStorage.getItem(`assignmentId`) as string)
              : assignmentId,
            nbOfProblems: sessionStorage.getItem(`nbOfProblems`)
              ? parseInt(sessionStorage.getItem(`nbOfProblems`) as string)
              : nbOfProblems,
          }}
          setIsSubmitted={setIsSubmitted}
        />
      ) : (
        <AssignmentResult
          results={result}
          grade={grade}
          assignmentId={
            sessionStorage.getItem(`assignmentId`)
              ? parseInt(sessionStorage.getItem(`assignmentId`) as string)
              : assignmentId
          }
          setIsSubmitted={setIsSubmitted}
        />
      )}
    </>
  );
};
