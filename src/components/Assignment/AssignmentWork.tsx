import {
  Box,
  Button,
  List,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/material";
import { Possibility } from "./Possibility";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

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
  const [problems, setProblems] = useState([] as problemsType[]);
  const [checkedPossibilities, setCheckedPossibilities] = useState(
    {} as { [key: string]: number }
  );
  const [confirmSubmission, setConfirmSubmission] = useState(true);

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
        })
        .then(() => {
          setIsSubmitted(true);
        });
    }
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
        {problems.map((problem) => (
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
              {problem.problemQuestion} <span style={{ color: `red` }}>*</span>
            </Typography>
            <List sx={{ borderRadius: radius, bgcolor: `#e5e5e5`, mt: `15px` }}>
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
                      checkedPossibilities[`problem_${problem.problemId}`] ==
                      element.possId
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
