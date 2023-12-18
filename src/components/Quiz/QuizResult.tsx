import {
  Box,
  List,
  RadioGroup,
  Stack,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import { Possibility } from "./Possibility";
import { resultType } from "../../pages/Quiz";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

export const QuizResult = ({
  results,
  grade,
  quizId,
  setIsSubmitted,
}: {
  results: resultType[];
  grade: number;
  quizId: number;
  setIsSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const radius = `12px`;

  const currentPath = location.pathname;
  const arrayPath = currentPath.split(`/`);
  const courseName = arrayPath[arrayPath.length - 2];

  const [openWarnDialaog, setOpenWarnDialaog] = useState(false);

  const navigate = useNavigate();

  return (
    <div className="container">
      <Box
        mt={3}
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
            {results.length}
          </Typography>
        </Stack>
        <Typography
          sx={{
            bgcolor: `white`,
            padding: `15px`,
            borderRadius: radius,
            mt: 2,
          }}
        >
          {grade <= results.length ? (
            <span style={{ color: `#f44036` }}>bad</span>
          ) : (
            <span style={{ color: `green` }}>good</span>
          )}
          , {grade} / {results.length * 2} !
        </Typography>
        {results.map((problem) => (
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
            <Stack
              direction={`row`}
              justifyContent={`space-between`}
              alignItems={`center`}
            >
              <Typography fontWeight={`bold`} fontSize={`18px`}>
                {problem.problemQuestion}{" "}
                <span style={{ color: `red` }}>*</span>
              </Typography>
              <Typography width={`75px`} textAlign={`end`}>
                {JSON.stringify(
                  problem.possibilities.filter(
                    (poss) =>
                      poss.isChecked === poss.isCorrect && poss.isChecked
                  )
                ) === `[]`
                  ? 0
                  : 2}{" "}
                / 2 <span style={{ color: `red` }}>*</span>
              </Typography>
            </Stack>
            <List
              sx={{
                borderRadius: radius,
                bgcolor: `#e5e5e5`,
                mt: `15px`,
                overflow: `hidden`,
              }}
            >
              <RadioGroup
                name="possibilities"
                aria-labelledby="possibilities-label"
              >
                {problem.possibilities.map((element) => (
                  <Possibility
                    key={element.possId}
                    sentence={element.possSentence}
                    possId={element.possId}
                    isChecked={element.isChecked}
                    isCorrect={element.isCorrect}
                    isDisabled={true}
                  />
                ))}
              </RadioGroup>
            </List>
          </Box>
        ))}
      </Box>
      <Stack
        direction={`row`}
        justifyContent={`space-between`}
        mt={`15px`}
        mb={10}
      >
        <Button
          variant="contained"
          sx={{ color: `white` }}
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
        <Button
          variant="contained"
          sx={{ color: `white` }}
          onClick={() => setOpenWarnDialaog(true)}
        >
          Restart
        </Button>
      </Stack>
      <Dialog
        open={openWarnDialaog}
        onClose={() => setOpenWarnDialaog(false)}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
        PaperProps={{
          style: {
            borderRadius: "12px",
            padding: "20px",
          },
        }}
      >
        <DialogTitle
          color={`primary`}
          sx={{ textAlign: `center`, fontSize: `28px`, fontWeight: `bold` }}
        >
          Warning!
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="dialog-description"
            sx={{ color: "secondary.dark", fontSize: 17, lineHeight: 1.8 }}
          >
            If you restarted the quiz, your previous response will expire.
          </DialogContentText>
          <DialogContentText
            id="dialog-description"
            sx={{
              color: "secondary.dark",
              fontSize: `19px`,
              fontWeight: "bold",
              textAlign: "center",
              marginTop: "20px",
            }}
          >
            Are you sure you want to restart?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenWarnDialaog(false)}
            variant="contained"
            color="secondary"
            sx={{
              color: "white",
              margin: "0 auto",
            }}
          >
            No
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              axios
                .post(`http://localhost/Ma-rifah/quiz/delete_record.php`, {
                  studentId: Cookies.get(`id`),
                  quizId,
                })
                .then(() => {
                  setIsSubmitted(false);
                });
            }}
            sx={{
              color: "white",
              margin: "0 auto",
            }}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
