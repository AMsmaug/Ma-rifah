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
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { CoursesContext } from "../Courses progress/CoursesContext";
import React from "react";
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

export const AssignmentWork = ({
  assignmentData,
  setIsSubmitted,
}: {
  assignmentData: { assignmentId: number; nbOfProblems: number };
  setIsSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const radius = `12px`;

  const { setStudentGrade, setStudentInfo } = useContext(CoursesContext);

  const location = useLocation();

  const { currentCourseId } = location.state;

  const [problems, setProblems] = useState([] as problemsType[]);
  const [checkedPossibilities, setCheckedPossibilities] = useState(
    {} as { [key: string]: number }
  );
  const [confirmSubmission, setConfirmSubmission] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  console.log(assignmentData.assignmentId);

  const currentPath = location.pathname;
  const arrayPath = currentPath.split(`/`);
  const courseName = arrayPath[arrayPath.length - 2];

  useEffect(() => {
    if (assignmentData.assignmentId !== 0)
      axios
        .post(`http://localhost/Ma-rifah/Assignment/get_problems.php`, {
          assignmentId: assignmentData.assignmentId,
          nbOfProblems: assignmentData.nbOfProblems,
        })
        .then((response: { data: problemsType[] }) => {
          console.log(response.data);
          setProblems(response.data);
          setIsLoading(false);
        });
  }, [assignmentData]);

  const handleSubmit = () => {
    if (Object.keys(checkedPossibilities).length !== problems.length) {
      setConfirmSubmission(false);
    } else {
      setConfirmSubmission(true);
      const problemIds = [] as string[];
      const keys = Object.keys(checkedPossibilities);
      keys.forEach((key) => {
        problemIds.push(key.split(`_`)[1]);
      });
      const studentAnswers = [] as number[];
      const values = Object.values(checkedPossibilities);
      values.forEach((value) => {
        studentAnswers.push(value);
      });
      axios
        .post(`http://localhost/Ma-rifah/Assignment/add_record.php`, {
          studentId: Cookies.get(`id`),
          assignmentId: assignmentData.assignmentId,
          problemIds,
          studentAnswers,
          courseId: currentCourseId,
        })
        .then(() => {
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
  };

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
                    {problem.problemParagraph.split("\n").map((item, index) => (
                      <React.Fragment key={index}>
                        {item[item.length - 2] === "n"
                          ? item.slice(0, item.length - 3)
                          : item}
                        {index <
                          problem.problemParagraph.split("\n").length - 1 && (
                          <br />
                        )}
                        {/* Add <br /> except for the last element */}
                      </React.Fragment>
                    ))}
                    {/* {problem.problemParagraph} */}
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
          onClick={handleSubmit}
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
