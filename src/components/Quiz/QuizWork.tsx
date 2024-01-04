import {
  Box,
  Button,
  List,
  RadioGroup,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { Possibility } from "./Possibility";
import { useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { CoursesContext } from "../Courses progress/CoursesContext";
import { useLocation } from "react-router-dom";

type problemsType = {
  problemId: number;
  problemParagraph: string;
  problemQuestion: string;
  possibilities: {
    possId: number;
    possSentence: string;
  }[];
};

export const QuizWork = ({
  quizData: quizData,
  duration,
  setIsSubmitted,
}: {
  quizData: { quizId: number; nbOfProblems: number };
  setIsSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
  duration: number;
}) => {
  const radius = `12px`;

  const { setStudentGrade, setStudentInfo } = useContext(CoursesContext);

  const [problems, setProblems] = useState([] as problemsType[]);
  const [checkedPossibilities, setCheckedPossibilities] = useState(
    {} as { [key: string]: number }
  );
  const [confirmSubmission, setConfirmSubmission] = useState(true);
  const [durationInMinutes, setDurationInMinutes] = useState(0);
  const [durationInSeconds, setDurationInSeconds] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const location = useLocation();

  const currentPath = location.pathname;
  const arrayPath = currentPath.split(`/`);
  const courseName = arrayPath[arrayPath.length - 2];

  const { currentCourseId } = location.state;

  console.log(`currentCourseId from quiz: ${currentCourseId}`);

  const handleSubmit = useCallback(
    (fromTimer: boolean) => {
      if (
        Object.keys(checkedPossibilities).length !== problems.length &&
        !fromTimer
      ) {
        setConfirmSubmission(false);
      } else {
        setConfirmSubmission(true);
        const problemIds = [] as number[];
        let studentAnswers = [] as number[] | null;
        const keys: string[] | null = Object.keys(checkedPossibilities);
        if (JSON.stringify(keys) === `[]`) {
          studentAnswers = null;
          problems.forEach((problem) => {
            problemIds.push(problem.problemId);
          });
        } else {
          keys?.forEach((key) => {
            problemIds.push(+key.split(`_`)[1]);
          });
          const values = Object.values(checkedPossibilities);
          values.forEach((value) => {
            studentAnswers?.push(value);
          });
        }
        axios
          .post(`http://localhost/Ma-rifah/quiz/add_record.php`, {
            studentId: Cookies.get(`id`),
            quizId: quizData.quizId,
            problemIds,
            studentAnswers,
            courseId: currentCourseId,
          })
          .then((response) => {
            console.log(response.data);
            setIsSubmitted(true);
            axios
              .post(
                `http://localhost/Ma-rifah/get_student_info.php`,
                Cookies.get(`id`)
              )
              .then((response) => {
                const studentInfo = response.data;
                setStudentInfo(studentInfo);
                let totalGrade = 0;
                if (Array.isArray(studentInfo))
                  studentInfo.forEach((student) => {
                    totalGrade += +student.studentGrade;
                  });
                setStudentGrade(totalGrade);
              });
          });
      }
    },
    [
      checkedPossibilities,
      problems,
      quizData.quizId,
      setIsSubmitted,
      setStudentGrade,
      setStudentInfo,
      currentCourseId,
    ]
  );

  useEffect(() => {
    const myInterval = setInterval(() => {
      if (+durationInSeconds !== 0) {
        setDurationInSeconds((previousSecond) => previousSecond - 1);
      } else {
        if (duration === 0) {
          setIsSubmitted(true);
        } else {
          if (durationInMinutes === 0) {
            // time's up
            clearInterval(myInterval);
            handleSubmit(true);
          } else {
            setDurationInSeconds(59);
            setDurationInMinutes((previousMinute) => previousMinute - 1);
          }
        }
      }
    }, 1000);

    return () => {
      clearInterval(myInterval);
    };
  }, [
    duration,
    durationInMinutes,
    durationInSeconds,
    handleSubmit,
    setIsSubmitted,
  ]);

  useEffect(() => {
    setDurationInMinutes(duration);
    if (quizData.quizId !== 0)
      axios
        .post(`http://localhost/Ma-rifah/quiz/get_problems.php`, {
          quizId: quizData.quizId,
          nbOfProblems: quizData.nbOfProblems,
        })
        .then((response: { data: problemsType[] }) => {
          console.log(response.data);
          setProblems(response.data);
          setIsLoading(false);
        });
  }, [duration, quizData]);

  const generateSkeletons = (nbOfSkeletons: number) => {
    const skeletons = [];
    for (let i = 0; i < nbOfSkeletons; i++) {
      skeletons.push(
        <Box
          bgcolor={`white`}
          borderRadius={radius}
          mt={2}
          padding={`20px`}
          key={i}
        >
          <Box m={`10px 0 20px`} fontSize={`17px`} />
          <Skeleton
            animation="wave"
            height={`80px`}
            sx={{ borderRadius: `12px` }}
          />
          <Skeleton
            animation="wave"
            height={`80px`}
            sx={{ borderRadius: `12px` }}
          />
          <Skeleton
            animation="wave"
            height={`80px`}
            sx={{ borderRadius: `12px` }}
          />
          <Skeleton
            animation="wave"
            height={`80px`}
            sx={{ borderRadius: `12px` }}
          />
        </Box>
      );
    }

    return skeletons;
  };

  return (
    <div className="container">
      <Box
        mt={3}
        mb={10}
        bgcolor={`#e5e5e5`}
        padding={`15px`}
        borderRadius={radius}
        position={`relative`}
      >
        <Stack
          bgcolor={`white`}
          padding={`15px`}
          borderRadius={radius}
          direction={`row`}
          justifyContent={`space-between`}
        >
          <Typography>
            <span style={{ fontWeight: `bold`, fontSize: `17px` }}>
              Material:
            </span>{" "}
            {courseName}
          </Typography>
          <Typography>
            <span style={{ fontWeight: `bold`, fontSize: `17px` }}>
              Questions count:
            </span>{" "}
            {problems.length}
          </Typography>
        </Stack>
        <Stack
          bgcolor={`white`}
          padding={`15px`}
          borderRadius={radius}
          direction={`row`}
          justifyContent={`space-between`}
          mt={`15px`}
        >
          <Typography>
            <span style={{ fontWeight: `bold`, fontSize: `17px` }}>
              Remaining time:
            </span>{" "}
            {`${durationInMinutes}`.length > 1
              ? durationInMinutes
              : `0${durationInMinutes}`}
            :
            {`${durationInSeconds}`.length > 1
              ? durationInSeconds
              : `0${durationInSeconds}`}
          </Typography>
        </Stack>
        {isLoading
          ? generateSkeletons(2)
          : problems.map((problem) => (
              <Box
                bgcolor={`white`}
                borderRadius={radius}
                mt={2}
                padding={`20px`}
                key={problem.problemId}
              >
                {problem.problemParagraph ? (
                  <Typography m={`10px 0 20px`} fontSize={`17px`}>
                    {problem.problemParagraph}
                  </Typography>
                ) : null}
                <Typography fontWeight={`bold`} fontSize={`18px`}>
                  {problem.problemQuestion}{" "}
                  <span style={{ color: `red` }}>*</span>
                </Typography>
                <List
                  sx={{ borderRadius: radius, bgcolor: `#e5e5e5`, mt: `15px` }}
                >
                  <RadioGroup
                    name="possibilities"
                    aria-labelledby="possibilities-label"
                    value={
                      checkedPossibilities[`problem_${problem.problemId}`] || ``
                    }
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setCheckedPossibilities((previous) => ({
                        ...previous,
                        [`problem_${problem.problemId}`]: +e.target.value,
                      }));
                      setConfirmSubmission(true);
                    }}
                  >
                    {problem.possibilities.map((element) => (
                      <Possibility
                        key={element.possId}
                        sentence={element.possSentence}
                        possId={element.possId}
                        isChecked={
                          checkedPossibilities[
                            `problem_${problem.problemId}`
                          ] == element.possId
                        }
                        isDisabled={false}
                      />
                    ))}
                  </RadioGroup>
                </List>
              </Box>
            ))}
        <Button
          sx={{
            color: `white`,
            width: `100%`,
            bgcolor: `#13213c`,
            mt: `15px`,
            padding: `10px 0`,
            borderRadius: radius,
            "&:hover": {
              bgcolor: `#fca311`,
            },
          }}
          onClick={() => handleSubmit(false)}
        >
          Submit
        </Button>
        {!confirmSubmission ? (
          <span
            style={{
              color: `red`,
              display: `block`,
              marginTop: `20px`,
              fontSize: `20px`,
              position: `absolute`,
              width: `100%`,
              textAlign: `center`,
              left: 0,
            }}
          >
            * All fields are required!
          </span>
        ) : null}
      </Box>
    </div>
  );
};
