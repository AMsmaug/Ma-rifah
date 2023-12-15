import { useEffect, useRef, useState } from "react";

import {
  Box,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
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

type problemType = {
  problemId: number;
  problemContent: string;
  choosenPossibilityId: number;
  problemPossibilities: problemPossibilitiesType;
};

type problemsType = problemType[];

type problemPossibilityType = {
  possibilityId: number;
  possibilityContent: string;
};

type problemPossibilitiesType = problemPossibilityType[];

type possibilitiesComponentType = {
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
};

type problemsToBeSentToServer = {
  problemId: number;
  choosenPossibilityId: number;
}[];

const FinalExam = () => {
  const [loadingFetchingProblems, setloadingFetchingProblems] =
    useState<boolean>(true);

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
  const audio1Ref = useRef<HTMLAudioElement>(null!);
  const audio2Ref = useRef<HTMLAudioElement>(null!);

  const navigate = useNavigate();
  const location = useLocation();

  const courseId = location.state?.courseId;

  // console.log(problems);

  useEffect(() => {
    function checkInternetConnection() {
      if (navigator.onLine) {
        fetch("http://localhost/Ma-rifah/test.php")
          .then((response) => {
            if (response.ok) {
              return;
            } else {
              console.log("Server not reachable.");
              showConnectionStatus(false);
            }
          })
          .catch((error) => {
            console.error("Error checking internet connection:", error);
            showConnectionStatus(false);
          });
      } else {
        showConnectionStatus(false);
      }
    }

    function showConnectionStatus(isConnected: boolean) {
      // Implement logic to display a message to the user based on connectivity status
      if (!isConnected) {
        // For example, display a notification or overlay to inform the user
        setsnackBarContent({
          status: "error",
          message:
            "You are currently offline. Please check your internet connection.",
        });
      }
    }

    // Check internet connection every 5 seconds (adjust the interval as needed)
    setInterval(checkInternetConnection, 5000);

    // Initial check when the page loads
    checkInternetConnection();
  }, []);

  useEffect(() => {
    if (courseId === undefined || courseId === null)
      navigate("/CoursesProgress");
    else {
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

          console.log(res);

          if (res.data.status === "success") {
            const { examId, courseName, finalExamDuration, examProblems } =
              res.data.payload;

            setexamInformation({ examId, courseName });
            setproblems(examProblems);
            settimeLeft(60 * Number(finalExamDuration));

            setsnackBarContent(null);
            setisExamStarted(true);
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

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${String(hours).padStart(2, "0")} h:${String(minutes).padStart(
        2,
        "0"
      )}`;
    } else if (minutes > 0) {
      return `${String(minutes).padStart(2, "0")}:${String(
        remainingSeconds
      ).padStart(2, "0")}`;
    } else {
      return `${remainingSeconds}s`;
    }
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
      };

      try {
        const res = await axios.post(
          "http://localhost/Ma-rifah/submit_final_exam.php",
          inputs
        );
        console.log(res);
        if (res.data.status === "success") {
          const grade = res.data.grade;

          setconfirmSubmitPopUp(false);
          setgradePopUp(true);
          setfinalExamGrade(grade);
          setisFinalSubmitted(true);

          setTimeout(() => {
            if (grade >= 50) {
              audio1Ref.current.play();
            } else {
              audio2Ref.current.play();
            }
          }, 700);
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

  const hanldeGoToMaterials = () => {
    navigate("/CoursesProgress/");
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
      {confirmSubmitPopUp && (
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
      )}
      {unAnsweredProblemDialog && (
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
      )}
      {
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
                <>
                  Congrats, your grade is {finalExamGrade}. You passed the exam.
                </>
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
      }
      {
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
              Oops, your final exam is not submitted because time is up! You
              should try again.
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
      }
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
      <Box
        className="container"
        sx={{
          height: "110vh",
          paddingTop: "15px",
        }}
      >
        <Stack
          sx={{
            backgroundColor: "#FFFFFFE4",
            borderRadius: "16px",
            overflow: "hidden",
            height: "calc(110vh - 30px)",
            padding: "25px 25px 10px 25px",
            marginBottom: "15px",
          }}
        >
          {loadingFetchingProblems ? (
            <LoadingComponent />
          ) : (
            <>
              <Box className="final-header">
                <Typography
                  variant="h4"
                  mb={2}
                  textAlign="center"
                  fontWeight="bold"
                >
                  {examInformation?.courseName} Final Exam
                </Typography>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  px={2}
                >
                  <Typography>
                    Total Number Of Questions:
                    <Typography component="span" ml={1} fontWeight="bold">
                      {problems?.length}
                    </Typography>
                  </Typography>
                  <Typography textAlign="end">
                    Time Left:
                    <Typography component="span" ml={1} fontWeight="bold">
                      {formatTime(timeLeft)}
                    </Typography>
                  </Typography>
                </Stack>
              </Box>
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
                      flex={1}
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
              <Box
                sx={{
                  position: "absolute",
                  right: "-5000px",
                  visibility: "hidden",
                }}
              >
                <audio ref={audio1Ref} controls>
                  <source
                    src="../../../public/allahakbar.mp3"
                    type="audio/mp3"
                  />
                  Your browser does not support the audio element.
                </audio>

                <audio ref={audio2Ref} controls>
                  <source src="../../../public/ahh.mp3" type="audio/mp3" />
                  Your browser does not support the audio element.
                </audio>
              </Box>
            </>
          )}
        </Stack>
      </Box>
    </Box>
  );
};

const Possibilities = (props: possibilitiesComponentType) => {
  const { problemId, problemPossibilities, handleChoosePoosibility } = props;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputs = {
      problemId,
      possibilityId: Number(e.target.value),
    };
    handleChoosePoosibility(inputs);
  };

  const check = () => {
    let nbRows = 6;

    problemPossibilities.forEach((p) => {
      if (p.possibilityContent.length > 20) nbRows = 12;
    });

    return nbRows;
  };

  return (
    <RadioGroup onChange={handleChange} name={`problem-${problemId}`}>
      <Grid container spacing={1}>
        {problemPossibilities.map((p) => (
          <Grid key={`possibility-id-${p.possibilityId}`} item xs={check()}>
            <Possibility
              possibilityId={p.possibilityId}
              possibilityContent={p.possibilityContent}
            />
          </Grid>
        ))}
      </Grid>
    </RadioGroup>
  );
};

const Possibility = (props: problemPossibilityType) => {
  const { possibilityId, possibilityContent } = props;

  return (
    <FormControlLabel
      sx={{
        border: "2px solid #ccc",
        borderRadius: "4px",
        width: "100%",
      }}
      control={<Radio />}
      label={possibilityContent}
      value={possibilityId}
    />
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
