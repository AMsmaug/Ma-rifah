import { useEffect, useState } from "react";
import { QuizWork } from "../components/Quiz/QuizWork";
import axios from "axios";
import Cookies from "js-cookie";
import { QuizResult } from "../components/Quiz/QuizResult";
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

export const Quiz = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [quizId, setquizId] = useState(0);
  const [nbOfProblems, setNbOfProblems] = useState(0);
  const [duration, setDuration] = useState(0);
  const [result, setResult] = useState([] as resultType[]);
  const [grade, setGrade] = useState(0);

  const location = useLocation();
  const chapterTitle = {
    number: location.state.number,
    name: location.state.name,
  };
  const currentChapterId = location.state.currentChapterId;

  console.log(location.state);

  useEffect(() => {
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
        }
      );
    // checking if the user has submitted the quiz
    axios
      .post(`http://localhost/Ma-rifah/Quiz/get_results.php`, {
        quizId,
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

  console.log(`isSubmitted : `, isSubmitted);

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
          <QuizWork
            quizData={{
              quizId,
              nbOfProblems,
            }}
            duration={duration}
            setIsSubmitted={setIsSubmitted}
          />
        ) : (
          <QuizResult
            results={result}
            grade={grade}
            quizId={quizId}
            setIsSubmitted={setIsSubmitted}
          />
        )}
      </>
    );
};
