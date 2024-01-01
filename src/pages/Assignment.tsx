import { useEffect, useState } from "react";
import { AssignmentWork } from "../components/Assignment/AssignmentWork";
import axios from "axios";
import Cookies from "js-cookie";
import { AssignmentResult } from "../components/Assignment/AssignmentResult";
import { Typography } from "@mui/material";
import { Navigate, useLocation } from "react-router-dom";

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
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [assignmentId, setAssignmentId] = useState(0);
  const [nbOfProblems, setNbOfProblems] = useState(0);
  const [result, setResult] = useState([] as resultType[]);
  const [grade, setGrade] = useState(0);

  const location = useLocation();
  const { chapterTitle, currentChapterId } = location.state;

  useEffect(() => {
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
        }
      );
    // checking if the user has submitted the assignment
    axios
      .post(`http://localhost/Ma-rifah/Assignment/get_results.php`, {
        assignmentId,
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

  if (chapterTitle === null) {
    const currentPath = location.pathname;
    const arrayPath = currentPath.split(`/`);
    const courseName = arrayPath[arrayPath.length - 2];
    return <Navigate to={`/Courses/${courseName}`} />;
  } else
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
              assignmentId,
              nbOfProblems: nbOfProblems,
            }}
            setIsSubmitted={setIsSubmitted}
          />
        ) : (
          <AssignmentResult
            results={result}
            grade={grade}
            assignmentId={assignmentId}
            setIsSubmitted={setIsSubmitted}
          />
        )}
      </>
    );
};
