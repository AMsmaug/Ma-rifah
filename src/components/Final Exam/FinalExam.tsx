import { useEffect, useRef, useState } from "react";

import {
  Box,
  Button,
  Stack,
  Grid,
  Typography,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";

import Cookies from "js-cookie";

import axios from "axios";

import UploadIcon from "@mui/icons-material/Upload";

import { SnackbarAlert } from "../custom snack bar/SnackbarAlert";
import Snackbar from "@mui/material/Snackbar";
import { useLocation, useNavigate } from "react-router-dom";

import {
  SubmittedFinalExam,
  submittedExamInformationType,
} from "./SubmittedFinalExam";
import { FinalHeader } from "./FinalHeader";
import { Possibilities } from "./Possibilities";

type problemType = {
  problemId: number;
  problemContent: string;
  choosenPossibilityId: number;
  problemPossibilities: problemPossibilitiesType;
};

type problemsType = problemType[];

export type problemPossibilityType = {
  possibilityId: number;
  possibilityContent: string;
};

type problemPossibilitiesType = problemPossibilityType[];

export type possibilitiesComponentType = {
  handleChoosePoosibility: (props: handleChoosePossibilityProps) => void;
  problemPossibilities: problemPossibilitiesType;
  problemId: number;
};

type handleChoosePossibilityProps = {
  problemId: number;
  possibilityId: number;
};

type snacBarContentType = {
  status: "success" | "error";
  message: string;
};

type examInformationType = {
  examId: number;
  courseName: string;
  examDuration: number;
  nbOfProblems: number;
};

type problemsToBeSentToServer = {
  problemId: number;
  choosenPossibilityId: number;
}[];

const FinalExam = () => {
  const [loadingFetchingProblems, setloadingFetchingProblems] =
    useState<boolean>(true);

  const [isexamRulesPopUpOpen, setisexamRulesPopUpOpen] =
    useState<boolean>(false);

  const [submittedExamInformation, setsubmittedExamInformation] =
    useState<submittedExamInformationType | null>(null);

  const [isExamStarted, setisExamStarted] = useState<boolean>(false);

  const [errorStartingExam, seterrorStartingExam] = useState<boolean>(false);

  const [problems, setproblems] = useState<problemsType>([]);

  const [examInformation, setexamInformation] =
    useState<null | examInformationType>(null);

  const [timeLeft, settimeLeft] = useState(60 * 60);

  const [timeIsUp, settimeIsUp] = useState<boolean>(false);

  const [canSubmitFinal, setcanSubmitFinal] = useState<boolean>(true);

  const [confirmSubmitPopUp, setconfirmSubmitPopUp] = useState<boolean>(false);

  const [isFinalSubmitted, setisFinalSubmitted] = useState<boolean>(false);

  const [unAnsweredProblemDialog, setunAnsweredProblemDialog] =
    useState<boolean>(false);

  // this is an array that contains the numbers of questions that hasn't been answered
  const [listOfUnAnsweredProblems, setlistOfUnAnsweredProblems] = useState<
    number[]
  >([]);

  const [gradePopUp, setgradePopUp] = useState<boolean>(false);

  const [finalExamGrade, setfinalExamGrade] = useState<number>(0);

  const [isreachedLastPage, setisreachedLastPage] = useState<boolean>(false);

  const [snackBarContent, setsnackBarContent] =
    useState<null | snacBarContentType>(null);

  const problemsScrollerRef = useRef<HTMLDivElement>(null!);
  const scrollContent = useRef<HTMLDivElement>(null!);
  const leftScrollButton = useRef<HTMLButtonElement>(null!);
  const rightScrollButton = useRef<HTMLButtonElement>(null!);

  const navigate = useNavigate();
  const location = useLocation();

  const courseId = location.state?.courseId;

  // console.log(problems);

  // confirm leaving the site without submitting the final

  useEffect(() => {
    if (submittedExamInformation !== null) return;
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      const message =
        "Are you sure you want to leave? Your progress may be lost.";
      event.returnValue = message;
      return message;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [submittedExamInformation]);

  useEffect(() => {
    if (courseId === undefined || courseId === null)
      navigate("/CoursesProgress");
    else {
      const f = async () => {
        const inputs = {
          studentId: Cookies.get("id"),
          courseId,
        };

        const res = await axios.post(
          "http://localhost/Ma-rifah/getLastFinalExam.php",
          inputs
        );

        if (res.data.status === "success") {
          if (res.data.message === "No submitted final exam") {
            const fetchProblems = async () => {
              const studentId = Cookies.get("id");

              const inputs = {
                studentId: studentId,
                courseId,
              };

              try {
                setloadingFetchingProblems(true);

                const res = await axios.post(
                  "http://localhost/Ma-rifah/start_final_exam.php",
                  inputs
                );

                if (res.data.status === "success") {
                  const {
                    examId,
                    courseName,
                    finalExamDuration,
                    examProblems,
                  } = res.data.payload;

                  const examDuration = 60 * Number(finalExamDuration);
                  const nbOfProblems = examProblems.length;

                  setexamInformation({
                    examId,
                    courseName,
                    examDuration,
                    nbOfProblems,
                  });
                  setproblems(examProblems);
                  settimeLeft(examDuration);

                  setsnackBarContent(null);

                  setisexamRulesPopUpOpen(true);

                  setloadingFetchingProblems(false);

                  seterrorStartingExam(false);
                } else if (res.data.status === "error") {
                  setexamInformation(null);
                  setproblems([]);
                  setsnackBarContent({
                    status: "error",
                    message: res.data.message,
                  });
                  seterrorStartingExam(true);
                  setloadingFetchingProblems(false);
                }

                setloadingFetchingProblems(false);

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
              } catch (error: any) {
                setsnackBarContent({
                  status: "error",
                  message: error.message,
                });
                setloadingFetchingProblems(false);
              }
            };

            fetchProblems();
          } else if (res.data.message === "submitted final exam exists") {
            setsubmittedExamInformation(res.data.payload);
            setloadingFetchingProblems(false);
            console.log(res.data);
          } else {
            setsnackBarContent({
              status: "error",
              message: "Unexpected Error",
            });
          }
        }
      };

      f();
    }
  }, [courseId, navigate]);

  useEffect(() => {
    if (!isExamStarted) return;

    const interval = setInterval(() => {
      if (isFinalSubmitted) {
        settimeLeft((prev) => prev);
        clearInterval(interval);
      } else {
        settimeLeft((prevTime) => prevTime - 1);

        if (timeLeft <= 0) {
          setconfirmSubmitPopUp(false);
          settimeIsUp(true);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isExamStarted, timeLeft, isFinalSubmitted]);

  const handleChoosePoosibility = (props: handleChoosePossibilityProps) => {
    const { problemId, possibilityId } = props;

    console.log(problemId, possibilityId);

    const p = Array.from(problems);

    p.forEach((problem) => {
      if (Number(problem.problemId) === Number(problemId)) {
        console.log("ohayooo");
        problem.choosenPossibilityId = possibilityId;
      }
    });

    setproblems(p);
  };

  const handleCloseAlert = () => {
    setsnackBarContent(null);
  };

  const scrollLeft = () => {
    disableScrollButton();

    problemsScrollerRef.current.scroll({
      left:
        problemsScrollerRef.current.scrollLeft -
        scrollContent.current.scrollWidth,
      behavior: "smooth",
    });

    setisreachedLastPage(false);

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

    setTimeout(() => {
      if (
        problemsScrollerRef.current.scrollLeft +
          problemsScrollerRef.current.clientWidth <=
          problemsScrollerRef.current.scrollWidth &&
        problemsScrollerRef.current.scrollLeft +
          problemsScrollerRef.current.clientWidth >
          problemsScrollerRef.current.scrollWidth -
            problemsScrollerRef.current.clientWidth
      ) {
        setisreachedLastPage(true);
      }
    }, 600);

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

  const handleSubmitExam = () => {
    if (isExamStarted && !timeIsUp) {
      let canSubmit = true;
      const listUnansweredProblems: number[] = [];

      problems.forEach((p, i) => {
        if (p.choosenPossibilityId === null) {
          canSubmit = false;
          listUnansweredProblems.push(i + 1);
        }
      });

      if (!canSubmit) {
        setunAnsweredProblemDialog(true);
        setlistOfUnAnsweredProblems(listUnansweredProblems);
        return;
      } else {
        setcanSubmitFinal(true);
        setconfirmSubmitPopUp(true);
      }
    }
  };

  const handleCloseExamRules = () => {
    setisExamStarted(true);
    setisexamRulesPopUpOpen(false);
  };

  const submitExam = async () => {
    if (canSubmitFinal && !timeIsUp) {
      const prblms: problemsToBeSentToServer = [];

      problems.forEach((p) => {
        const problemId = p.problemId;
        const choosenPossibilityId = p.choosenPossibilityId;
        const inputs = {
          problemId,
          choosenPossibilityId,
        };
        prblms.push(inputs);
      });

      const inputs = {
        examId: examInformation?.examId,
        problems: prblms,
        studentId: Cookies.get("id"),
        courseId,
      };

      try {
        const res = await axios.post(
          "http://localhost/Ma-rifah/submit_final_exam.php",
          inputs
        );
        console.log(inputs);
        console.log(res);
        if (res.data.status === "success") {
          const grade = res.data.grade;

          setconfirmSubmitPopUp(false);
          setgradePopUp(true);
          setfinalExamGrade(grade);
          setisFinalSubmitted(true);
        } else {
          setsnackBarContent({
            status: "error",
            message: res.data.message,
          });
        }
      } catch (error) {
        setsnackBarContent({
          status: "error",
          message: "Unexpected error",
        });
      }
    }
  };

  const handleCloseConfirmSubmitPopUp = () => {
    setconfirmSubmitPopUp(false);
  };

  const handleClose = () => {
    setunAnsweredProblemDialog(false);
  };

  const handleCloseErrorStartingExam = () => {
    seterrorStartingExam(false);
  };

  return (
    <Box
      sx={{
        backgroundImage: "url('../../../public/images/bookss.jpg')",
        backgroundSize: "cover",
      }}
    >
      {snackBarContent !== null && (
        <Snackbar
          open={snackBarContent !== null}
          autoHideDuration={10000}
          onClose={handleCloseAlert}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <SnackbarAlert
            onClose={handleCloseAlert}
            severity="error"
            sx={{ padding: "12px 15px", fontSize: "17px" }}
          >
            {snackBarContent.message}
          </SnackbarAlert>
        </Snackbar>
      )}

      {errorStartingExam && (
        <Snackbar
          open={errorStartingExam}
          autoHideDuration={10000}
          onClose={handleCloseErrorStartingExam}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <SnackbarAlert
            onClose={handleCloseErrorStartingExam}
            severity="error"
            sx={{ padding: "12px 15px", fontSize: "17px" }}
          >
            Error Starting Exam. Try again.
          </SnackbarAlert>
        </Snackbar>
      )}

      <ConfirmSubmitDialog
        confirmSubmitPopUp={confirmSubmitPopUp}
        timeIsUp={timeIsUp}
        handleCloseConfirmSubmitPopUp={handleCloseConfirmSubmitPopUp}
        submitExam={submitExam}
      />

      <UnAnsweredProblemDialog
        unAnsweredProblemDialog={unAnsweredProblemDialog}
        listOfUnAnsweredProblems={listOfUnAnsweredProblems}
        handleClose={handleClose}
      />

      <AfterSubmittingExamDialog
        gradePopUp={gradePopUp}
        finalExamGrade={finalExamGrade}
      />

      <TimeIsUpDialog timeIsUp={timeIsUp} />

      <Box
        className="container"
        sx={{
          height: {
            xs: "140vh",
            md: "115vh",
          },
          paddingTop: "15px",
        }}
      >
        <Stack
          sx={{
            backgroundColor: "#FFFFFFE4",
            borderRadius: "16px",
            overflow: "hidden",
            height: {
              xs: "140vh",
              md: "calc(115vh - 30px)",
            },
            padding: {
              xs: "5px",
              md: "25px 25px 10px 25px",
            },
            marginBottom: "15px",
          }}
        >
          {loadingFetchingProblems ? (
            <LoadingComponent />
          ) : submittedExamInformation !== null ? (
            <SubmittedFinalExam
              examId={submittedExamInformation?.examId}
              grade={submittedExamInformation?.grade}
              courseName={submittedExamInformation?.courseName}
              problems={submittedExamInformation?.problems}
            />
          ) : isexamRulesPopUpOpen ? (
            <ExamRulesDialog
              isexamRulesPopUpOpen={isexamRulesPopUpOpen}
              examInformation={examInformation}
              handleCloseExamRules={handleCloseExamRules}
            />
          ) : (
            <>
              <FinalHeader
                courseName={examInformation?.courseName}
                timeLeft={timeLeft}
                nbOfProblems={problems?.length}
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
                      <Typography variant="h6" mb={1} fontWeight="bold">
                        {`${i + 1}. ${p.problemContent}`}
                      </Typography>
                      <Possibilities
                        problemId={p.problemId}
                        handleChoosePoosibility={handleChoosePoosibility}
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
                {isreachedLastPage ? (
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<UploadIcon />}
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      borderRadius: "20px",
                      width: "120px",
                    }}
                    onClick={handleSubmitExam}
                    disabled={timeIsUp}
                  >
                    Submit
                  </Button>
                ) : (
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
                )}
              </Stack>
            </>
          )}
        </Stack>
      </Box>
    </Box>
  );
};

export default FinalExam;

const LoadingComponent = () => {
  return (
    <Box
      sx={{
        height: "100%",
      }}
    >
      <Skeleton
        variant="rectangular"
        animation="wave"
        height={40}
        sx={{ marginBottom: "16px" }}
      />
      <Skeleton
        variant="rectangular"
        animation="wave"
        height={24}
        sx={{ marginBottom: "30px" }}
      />
      <>
        <Skeleton
          variant="rectangular"
          animation="wave"
          height={30}
          sx={{ marginBottom: "25px" }}
        />
        <Grid container spacing={1} mb={2}>
          <Grid
            item
            xs={6}
            sx={{
              borderRadius: "4px",
            }}
          >
            <Skeleton variant="rectangular" animation="wave" height={45} />
          </Grid>
          <Grid
            item
            xs={6}
            sx={{
              borderRadius: "4px",
            }}
          >
            <Skeleton variant="rectangular" animation="wave" height={45} />
          </Grid>
          <Grid
            item
            xs={6}
            sx={{
              borderRadius: "4px",
            }}
          >
            <Skeleton variant="rectangular" animation="wave" height={45} />
          </Grid>
          <Grid
            item
            xs={6}
            sx={{
              borderRadius: "4px",
            }}
          >
            <Skeleton variant="rectangular" animation="wave" height={45} />
          </Grid>
        </Grid>
      </>

      <>
        <Skeleton
          variant="rectangular"
          animation="wave"
          height={30}
          sx={{ marginBottom: "25px" }}
        />
        <Grid container spacing={1} mb={2}>
          <Grid
            item
            xs={6}
            sx={{
              borderRadius: "4px",
            }}
          >
            <Skeleton variant="rectangular" animation="wave" height={45} />
          </Grid>
          <Grid
            item
            xs={6}
            sx={{
              borderRadius: "4px",
            }}
          >
            <Skeleton variant="rectangular" animation="wave" height={45} />
          </Grid>
          <Grid
            item
            xs={6}
            sx={{
              borderRadius: "4px",
            }}
          >
            <Skeleton variant="rectangular" animation="wave" height={45} />
          </Grid>
          <Grid
            item
            xs={6}
            sx={{
              borderRadius: "4px",
            }}
          >
            <Skeleton variant="rectangular" animation="wave" height={45} />
          </Grid>
        </Grid>
      </>
    </Box>
  );
};

const TimeIsUpDialog = (props: { timeIsUp: boolean }) => {
  const { timeIsUp } = props;

  const navigate = useNavigate();

  const hanldeGoToMaterials = () => {
    navigate("/Courses/");
  };

  return (
    <Dialog
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      open={timeIsUp}
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
        Time Is Up!
      </DialogTitle>
      <DialogContent sx={{ marginBottom: "20px" }}>
        <DialogContentText
          id="dialog-description"
          sx={{
            fontSize: "18px",
          }}
        >
          Oops, your final exam is not submitted because time is up! You should
          try again.
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
          autoFocus
          variant="contained"
          sx={{
            color: "white",
          }}
          onClick={hanldeGoToMaterials}
        >
          Go to materials
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const AfterSubmittingExamDialog = (props: {
  gradePopUp: boolean;
  finalExamGrade: number;
}) => {
  const { gradePopUp, finalExamGrade } = props;

  const navigate = useNavigate();

  const hanldeGoToMaterials = () => {
    navigate("/Courses/");
  };

  return (
    <Dialog
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      open={gradePopUp}
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
        Your Final Exam Grade
      </DialogTitle>
      <DialogContent sx={{ marginBottom: "20px" }}>
        <DialogContentText
          id="dialog-description"
          sx={{
            fontSize: "18px",
          }}
        >
          {gradePopUp && finalExamGrade < 50 ? (
            <>
              Oops, your grade is {finalExamGrade}. I hope you can do better
              next time.
            </>
          ) : (
            <>Congrats, your grade is {finalExamGrade}. You passed the exam.</>
          )}
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
          sx={{
            color: "white",
          }}
          onClick={hanldeGoToMaterials}
        >
          Go to materials
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const UnAnsweredProblemDialog = (props: {
  unAnsweredProblemDialog: boolean;
  listOfUnAnsweredProblems: number[];
  handleClose: () => void;
}) => {
  const { unAnsweredProblemDialog, listOfUnAnsweredProblems, handleClose } =
    props;

  return (
    <Dialog
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      open={unAnsweredProblemDialog}
      onClose={handleClose}
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
        Submit the Exam?
      </DialogTitle>
      <DialogContent sx={{ marginBottom: "20px" }}>
        <DialogContentText
          id="dialog-description"
          sx={{
            fontSize: "18px",
          }}
        >
          You didn't answer question{" "}
          {listOfUnAnsweredProblems.map((p) => (
            <span>{p} </span>
          ))}
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
          onClick={handleClose}
          sx={{
            color: "white",
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const ConfirmSubmitDialog = (props: {
  confirmSubmitPopUp: boolean;
  submitExam: () => void;
  handleCloseConfirmSubmitPopUp: () => void;
  timeIsUp: boolean;
}) => {
  const {
    confirmSubmitPopUp,
    timeIsUp,
    submitExam,
    handleCloseConfirmSubmitPopUp,
  } = props;

  return (
    <Dialog
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      open={confirmSubmitPopUp}
      onClose={handleCloseConfirmSubmitPopUp}
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
        Submit the Exam?
      </DialogTitle>
      <DialogContent sx={{ marginBottom: "20px" }}>
        <DialogContentText
          id="dialog-description"
          sx={{
            fontSize: "18px",
          }}
        >
          Are you sure you want to submit the Exam? You will not be able to
          change your answers after the submission.
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
          onClick={handleCloseConfirmSubmitPopUp}
          sx={{
            color: "white",
          }}
        >
          Cancel
        </Button>
        <Button
          autoFocus
          variant="contained"
          onClick={submitExam}
          sx={{
            color: "white",
          }}
          disabled={timeIsUp}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const ExamRulesDialog = (props: {
  isexamRulesPopUpOpen: boolean;
  examInformation: examInformationType | null;
  handleCloseExamRules: () => void;
}) => {
  const { isexamRulesPopUpOpen, examInformation, handleCloseExamRules } = props;

  const calculateExamDurationInMinutes = (time: number) => {
    return time / 60;
  };

  return (
    <Dialog
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      open={isexamRulesPopUpOpen}
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
        Exam Rules
      </DialogTitle>
      <DialogContent sx={{ marginBottom: "20px" }}>
        <DialogContentText
          id="dialog-description"
          sx={{
            fontSize: "18px",
          }}
        >
          <span></span>
          Be careful , if you haven't submit the exam before time is finished
          the exam will not be considered done. <br /> <br />
          Exam duration:{" "}
          <span>
            {examInformation?.examDuration !== undefined &&
              calculateExamDurationInMinutes(examInformation?.examDuration)}
          </span>
          minutes
          <br />
          Number Of Problems: {examInformation?.nbOfProblems}
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
          autoFocus
          variant="contained"
          sx={{
            color: "white",
          }}
          onClick={handleCloseExamRules}
        >
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
};
