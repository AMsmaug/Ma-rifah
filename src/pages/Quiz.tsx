import { useContext, useEffect, useState } from "react";
import { QuizWork } from "../components/Quiz/QuizWork";
import { CoursesContext } from "../components/Courses progress/CoursesContext";
import axios from "axios";
import Cookies from "js-cookie";
import { QuizResult } from "../components/Quiz/QuizResult";
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

export const Quiz = () => {
  const { currentChapterId } = useContext(CoursesContext);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [quizId, setquizId] = useState(0);
  const [nbOfProblems, setNbOfProblems] = useState(0);
  const [duration, setDuration] = useState(0);
  const [result, setResult] = useState([] as resultType[]);
  const [grade, setGrade] = useState(0);

  useEffect(() => {}, []);

  useEffect(() => {
    if (currentChapterId !== 0) {
      console.log(`currentChapterId from quiz: `, currentChapterId);
      axios
        .post(
          `http://localhost/Ma-rifah/Quiz/get_quiz_data.php`,
          currentChapterId
        )
        .then(
          (response: {
            data: {
              quizId: number;
              chapterId: number;
              numberOfProblems: number;
              durationInMinutes: number;
            };
          }) => {
            setquizId(response.data.quizId);
            setNbOfProblems(response.data.numberOfProblems);
            setDuration(response.data.durationInMinutes);
            sessionStorage.setItem(`quizId`, `${response.data.quizId}`);
            sessionStorage.setItem(
              `nbOfProblems`,
              `${response.data.numberOfProblems}`
            );
            sessionStorage.setItem(
              `duration`,
              `${response.data.durationInMinutes}`
            );
          }
        );
    }
    // checking if the user has submitted the quiz
    if (quizId !== 0 || sessionStorage.getItem(`quizId`))
      axios
        .post(`http://localhost/Ma-rifah/Quiz/get_results.php`, {
          quizId:
            quizId !== 0
              ? quizId
              : sessionStorage.getItem(`quizId`)
              ? sessionStorage.getItem(`quizId`)
              : null,
          studentId: Cookies.get(`id`),
        })
        .then(
          (response: {
            data: { status: string; grade: number; payload: resultType[] };
          }) => {
            console.log(`quiz id: `, quizId);
            if (response.data.status === `success`) {
              setIsSubmitted(true);
              setResult(response.data.payload);
              setGrade(response.data.grade);
            } else {
              setIsSubmitted(false);
            }
          }
        );
  }, [quizId, currentChapterId, isSubmitted, duration]);

  const location = useLocation();
  const chapterTitle = location.state;

  console.log(`isSubmitted : `, isSubmitted);

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
        <QuizWork
          quizData={{
            quizId: sessionStorage.getItem(`quizId`)
              ? parseInt(sessionStorage.getItem(`quizId`) as string)
              : quizId,
            nbOfProblems: sessionStorage.getItem(`nbOfProblems`)
              ? parseInt(sessionStorage.getItem(`nbOfProblems`) as string)
              : nbOfProblems,
          }}
          duration={
            duration !== 0
              ? duration
              : sessionStorage.getItem(`duration`)
              ? parseInt(sessionStorage.getItem(`duration`) as string)
              : 0
          }
          setIsSubmitted={setIsSubmitted}
        />
      ) : (
        <QuizResult
          results={result}
          grade={grade}
          quizId={
            sessionStorage.getItem(`assignmentId`)
              ? parseInt(sessionStorage.getItem(`assignmentId`) as string)
              : quizId
          }
          setIsSubmitted={setIsSubmitted}
        />
      )}
    </>
  );
};
