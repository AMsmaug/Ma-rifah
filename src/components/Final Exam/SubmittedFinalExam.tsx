import { useRef, useState } from "react";
import {
  Box,
  Button,
  Stack,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";

import { LoadingButton } from "@mui/lab";

import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import ReplayIcon from "@mui/icons-material/Replay";

import axios from "axios";

type problemsType = {
  problemId: number;
  problemContent: string;
  choosenPossibilityId: number;
  problemPossibilities: submittedPossibilityType[];
}[];

export type submittedExamInformationType = {
  examId: number;
  courseName: string;
  grade: number;
  problems: problemsType;
};

type submittedPossibilityType = {
  possibilityId: number;
  possibilityContent: string;
  is_correct: number;
};

type submittedPossibilitiesType = {
  choosenPossibilityId: number;
  problemPossibilities: submittedPossibilityType[];
};

type FinalHeaderType = {
  courseName: string;
  numberOfProblems: number;
  grade: number;
  loadingRedoingExam: boolean;
  redoExam: () => void;
};

export const SubmittedFinalExam = (props: submittedExamInformationType) => {
  const { examId, grade, courseName, problems } = props;

  const [loadingRedoingExam, setloadingRedoingExam] = useState<boolean>(false);

  const problemsScrollerRef = useRef<HTMLDivElement>(null!);
  const scrollContent = useRef<HTMLDivElement>(null!);
  const leftScrollButton = useRef<HTMLButtonElement>(null!);
  const rightScrollButton = useRef<HTMLButtonElement>(null!);

  const scrollLeft = () => {
    disableScrollButton();

    problemsScrollerRef.current.scroll({
      left:
        problemsScrollerRef.current.scrollLeft -
        scrollContent.current.scrollWidth,
      behavior: "smooth",
    });

    setTimeout(enableScrollButton, 600);
  };

  const scrollRight = () => {
    disableScrollButton();

    problemsScrollerRef.current.scroll({
      left:
        problemsScrollerRef.current.scrollLeft +
        scrollContent.current.scrollWidth,
      behavior: "smooth",
    });

    setTimeout(enableScrollButton, 600);
  };

  const disableScrollButton = () => {
    if (leftScrollButton) {
      leftScrollButton.current.disabled = true;
    }

    if (rightScrollButton.current !== null) {
      rightScrollButton.current.disabled = true;
    }
  };

  const enableScrollButton = () => {
    if (leftScrollButton) {
      leftScrollButton.current.disabled = false;
    }

    if (rightScrollButton.current !== null) {
      rightScrollButton.current.disabled = false;
    }
  };

  const redoExam = async () => {
    try {
      setloadingRedoingExam(true);
      const res = await axios.post(
        "http://localhost/Ma-rifah/redo_exam.php",
        examId
      );
      setloadingRedoingExam(false);
      if (res.data.status === "success") {
        window.location.reload();
      }
    } catch (error) {
      console.error("Failed redoing exam!");
    }
  };

  const isAnswerCorrect = (problemId: number) => {
    let result = false;
    problems.forEach((p) => {
      if (Number(p.problemId) === Number(problemId)) {
        console.log("here");
        p.problemPossibilities.forEach((possibility) => {
          if (
            Number(p.choosenPossibilityId) ===
              Number(possibility.possibilityId) &&
            Number(possibility.is_correct) === 1
          ) {
            console.log("here2");
            result = true;
          }
        });
      }
    });
    return result;
  };

  return (
    <>
      <FinalHeader
        courseName={courseName}
        numberOfProblems={problems.length}
        grade={grade}
        redoExam={redoExam}
        loadingRedoingExam={loadingRedoingExam}
      />
      <Stack
        flex="1"
        sx={{ flexWrap: "wrap", overflow: "hidden" }}
        mt={1}
        spacing={2}
        ref={problemsScrollerRef}
      >
        {problems.length > 0 &&
          problems.map((p, i) => (
            <Box
              key={`final-problem-${i}`}
              px={2}
              flex={0.3}
              width="100%"
              ref={scrollContent}
            >
              <Stack
                mb={1}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                pr={2}
              >
                <Typography variant="h6" fontWeight="bold">
                  {`${i + 1}. ${p.problemContent}`}
                </Typography>
                <Typography>
                  {isAnswerCorrect(p.problemId) ? "5" : "0"} / 5
                </Typography>
              </Stack>

              <SubmittedFinalExamPossibilities
                choosenPossibilityId={p.choosenPossibilityId}
                problemPossibilities={p.problemPossibilities}
              />
            </Box>
          ))}
      </Stack>
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={3}
        mt={2}
      >
        <Button
          variant="contained"
          color="secondary"
          sx={{
            color: "white",
            fontWeight: "bold",
            borderRadius: "20px",
            width: "120px",
          }}
          onClick={scrollLeft}
          ref={leftScrollButton}
        >
          previous
        </Button>
        <Button
          variant="contained"
          color="secondary"
          sx={{
            color: "white",
            fontWeight: "bold",
            borderRadius: "20px",
            width: "120px",
          }}
          onClick={scrollRight}
          ref={rightScrollButton}
        >
          Next
        </Button>
      </Stack>
    </>
  );
};

const FinalHeader = (props: FinalHeaderType) => {
  const [confirmRedoExamPopup, setconfirmRedoExamPopup] =
    useState<boolean>(false);

  const handleOpenConfirmRedoExam = () => {
    setconfirmRedoExamPopup(true);
  };

  const handleCloseConfirmRedoExam = () => {
    setconfirmRedoExamPopup(false);
  };

  const { courseName, numberOfProblems, grade, loadingRedoingExam, redoExam } =
    props;
  return (
    <Box className="final-header" mb={1}>
      {confirmRedoExamPopup && (
        <Dialog
          aria-labelledby="dialog-title"
          aria-describedby="dialog-description"
          open={confirmRedoExamPopup}
          onClose={handleCloseConfirmRedoExam}
        >
          <DialogTitle
            id="dialog-title"
            sx={{
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "30px",
              marginBottom: "20px",
            }}
          >
            Redo The Exam
          </DialogTitle>
          <DialogContent sx={{ marginBottom: "20px" }}>
            <DialogContentText
              id="dialog-description"
              sx={{
                fontSize: "18px",
              }}
            >
              Are you sure you want to Redo the Exam? You will not be able to
              see the result of this final exam again.
            </DialogContentText>
          </DialogContent>
          <DialogActions
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "20px",
              marginBottom: "10px",
            }}
          >
            <Button
              variant="contained"
              color="secondary"
              onClick={handleCloseConfirmRedoExam}
              sx={{
                color: "white",
              }}
            >
              Cancel
            </Button>
            <Button
              autoFocus
              variant="contained"
              onClick={redoExam}
              sx={{
                color: "white",
              }}
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      )}
      <Typography variant="h4" mb={2} textAlign="center" fontWeight="bold">
        {courseName} Final Exam
      </Typography>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        px={2}
      >
        <Typography>
          Total Number Of Problems:
          <Typography component="span" ml={1} fontWeight="bold">
            {numberOfProblems}
          </Typography>
        </Typography>
        <Typography>
          Your Grade:
          <Typography component="span" ml={1} fontWeight="bold">
            {grade}
          </Typography>
        </Typography>
        {/* <LoadingButton
          variant="contained"
          color="secondary"
          onClick={handleOpenConfirmRedoExam}
          loading={loadingRedoingExam}
          startIcon={<ReplayIcon />}
        >
          Redo The Exam
        </LoadingButton> */}
      </Stack>
    </Box>
  );
};

const SubmittedFinalExamPossibilities = (props: submittedPossibilitiesType) => {
  const { choosenPossibilityId, problemPossibilities } = props;

  const check = () => {
    let nbRows = 6;

    problemPossibilities.forEach((p) => {
      if (p.possibilityContent.length > 10) nbRows = 12;
    });

    return nbRows;
  };

  const checkCorrectPossibility = (
    choosenPossibilityId: number,
    thisPossibilityId: number,
    is_correct: number
  ) => {
    if (thisPossibilityId == choosenPossibilityId && is_correct == 1) {
      return "correct";
    } else if (thisPossibilityId == choosenPossibilityId && is_correct == 0) {
      return "incorrect";
    } else if (is_correct == 1) {
      return "correct";
    } else {
      return "";
    }
  };

  return (
    <RadioGroup aria-disabled>
      <Grid container columnGap={1}>
        {problemPossibilities.map((p) => (
          <Grid
            key={`possibility-id-${p.possibilityId}`}
            item
            xs={12}
            sm={check()}
            sx={{
              padding: "3px 10px !important",
              marginBottom: "5px",
              flexBasis: "49% !important",
              maxWidth: {
                md: "49% !important",
              },
              flex: {
                xs: "1",
                md: "0",
              },
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              border: "2px solid #ccc",
              borderRadius: "4px",
              "&.correct": {
                backgroundColor: "#4CAF4F93",
              },
              "&.incorrect": {
                backgroundColor: "#EF5350A2",
              },
            }}
            className={checkCorrectPossibility(
              choosenPossibilityId,
              p.possibilityId,
              p.is_correct
            )}
          >
            <FormControlLabel
              sx={{
                flex: "1",
                pointerEvents: "none",
              }}
              control={
                <Radio
                  color="default"
                  checked={p.possibilityId === choosenPossibilityId}
                />
              }
              label={p.possibilityContent}
              value={p.possibilityId}
            />
            {checkCorrectPossibility(
              choosenPossibilityId,
              p.possibilityId,
              p.is_correct
            ) === "correct" ? (
              <CheckRoundedIcon color="success" />
            ) : checkCorrectPossibility(
                choosenPossibilityId,
                p.possibilityId,
                p.is_correct
              ) === "incorrect" ? (
              <ClearRoundedIcon color="error" />
            ) : (
              <></>
            )}
          </Grid>
        ))}
      </Grid>
    </RadioGroup>
  );
};
