import { useState, useRef, useEffect } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { Avatar, Button, Divider, Paper, Menu, MenuItem } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { LoadingButton } from "@mui/lab";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import {
  questionType,
  answersType,
  calculateDate,
  Answer,
} from "./QuestionsAndAnswers";

export const Question = (props: questionType) => {
  // const { isLoggedIn } = useContext(ActiveContext);
  const [displayedAnswers, setdisplayedAnswers] = useState<answersType>([]);

  // This state to check if the user expanded all answers to display the view less button
  const [hasReachedMaxAnswers, sethasReachedMaxAnswers] =
    useState<boolean>(false);

  // This state for updating question loading
  const [loading] = useState<boolean>(false);

  // This state for deleting question loading
  const [loading2, setloading2] = useState<boolean>(false);

  const [confirmingDeletePopUp, setconfirmingDeletePopUp] =
    useState<boolean>(false);

  // This is for displaying the menu
  const [anchorEl, setanchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  // After pressing on delete question. update question button will be disabled
  const [updateQuestionDisabled, setupdateQuestionDisabled] =
    useState<boolean>(false);

  const textAreaRef = useRef<HTMLTextAreaElement>(null!);

  const {
    questionId,
    questionContent,
    questionDate,
    imageURL,
    studentId,
    studentName,
    studentAvatar,
    questionAnswers,
    removeQuestion,
    addAnswer,
    removeAnswer,
    setisSnackbarOpen,
    setsnackbarContent,
    openMustLoginPopup,
    handleChangeRating,
  } = props;

  // Add answer.
  const handleClick = () => {
    if (Cookies.get("id") === undefined) {
      openMustLoginPopup();
    } else {
      const id = Cookies.get("id");

      const currentDate = new Date();

      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const day = String(currentDate.getDate()).padStart(2, "0");

      const hours = String(currentDate.getHours()).padStart(2, "0");
      const minutes = String(currentDate.getMinutes()).padStart(2, "0");
      const seconds = String(currentDate.getSeconds()).padStart(2, "0");

      const formattedDatetime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

      // This formatted date is in the following format: yyyy-mm-dd to be valid as mysql date
      const inputs = {
        answerContent: textAreaRef.current.value,
        answerDate: formattedDatetime,
        studentId: id,
        questionId,
      };

      axios
        .post("http://localhost/Ma-rifah/add_answer.php", inputs)
        .then((res) => {
          const newAnswer = {
            questionId,
            answerId: res.data.message,
            answerContent: textAreaRef.current.value,
            answerDate: formattedDatetime,
            answerSumRating: 0,
            numberOfRaters: 0,
            myRate: 0,
            studentId: Number(Cookies.get("id")),
            studentName: "Abdallah Al-Korhani",
            studentAvatar: "../../../public/images/av6.png",
          };

          const answers = Array.from(questionAnswers);
          answers.push(newAnswer);

          addAnswer({
            questionId,
            questionContent,
            questionDate: formattedDatetime,
            studentId: Number(Cookies.get("id")),
            imageURL,
            studentName,
            studentAvatar,
            questionAnswers: answers,
          });
          textAreaRef.current.value = "";
        })
        .catch((error) => console.log(error));
    }
  };

  // In case this question is for the logged in user. The user can remove it or update it. So an icon button will be displayed
  // and a menu will show up. This menu contains two options update question and remove question.
  const handleClick2 = (event: React.MouseEvent<HTMLButtonElement>) => {
    setanchorEl(event.currentTarget);
  };

  const handleClose2 = () => {
    setanchorEl(null);
  };

  useEffect(() => {
    // This function returns at first 3 answers.
    // If there are no answers.
    if (questionAnswers.length === 0) return;

    // The question might have only 1 answer or 2 or 3.
    if (questionAnswers.length > 0 && questionAnswers.length < 4) {
      const firstFewAnswers = questionAnswers.slice(0, questionAnswers.length);
      setdisplayedAnswers(firstFewAnswers);
      return;
    } else {
      // There are more than 3 answers. Display the first three answers
      setdisplayedAnswers(questionAnswers.slice(0, 3));
    }
  }, [questionAnswers]);

  const getMoreAnswers = () => {
    // In case there are more 3 questions to display
    if (displayedAnswers.length + 3 <= questionAnswers.length) {
      // It means there are 3 more answers to display
      const moreAnswers = questionAnswers.slice(0, displayedAnswers.length + 3);
      setdisplayedAnswers(moreAnswers);
      sethasReachedMaxAnswers(false);
    } else {
      const moreAnswers = questionAnswers.slice(0, questionAnswers.length);
      setdisplayedAnswers(moreAnswers);
      sethasReachedMaxAnswers(true);
    }
  };

  const showLessAnswers = () => {
    setdisplayedAnswers(questionAnswers.slice(0, 3));
    sethasReachedMaxAnswers(false);
  };

  const deleteQuestion = async () => {
    setloading2(true);
    setupdateQuestionDisabled(true);
    const res = await axios.delete(
      "http://localhost/Ma-rifah/delete_question.php?id=" + questionId
    );

    if (res.data.status === "success") {
      removeQuestion(questionId);
      setisSnackbarOpen(true);
      setsnackbarContent({ status: "success", message: res.data.message });
      setloading2(false);
    } else {
      setupdateQuestionDisabled(false);
      setisSnackbarOpen(true);
      setsnackbarContent({
        status: "error",
        message: "Error deleting question",
      });
      setloading2(false);
    }
  };

  const openConfirmDeletePopUp = () => {
    setconfirmingDeletePopUp(true);
  };

  // This is for closing the confirm delete question pop up
  const handleClose3 = () => {
    setconfirmingDeletePopUp(false);
  };

  // Confirm deleting question
  const confirmDelete = () => {
    deleteQuestion();
  };

  const changeRating = (props: {
    answerId: number;
    myRate: number;
    answerSumRating: number;
    numberOfRaters: number;
  }) => {
    handleChangeRating({
      answerId: props.answerId,
      myRate: props.myRate,
      answerSumRating: props.answerSumRating,
      numberOfRaters: props.numberOfRaters,
      questionId,
    });
  };

  return (
    <>
      {confirmingDeletePopUp && (
        <Dialog
          aria-labelledby="dialog-title"
          aria-describedby="dialog-description"
          open={confirmingDeletePopUp}
          onClose={handleClose3}
        >
          <DialogTitle
            id="dialog-title"
            fontSize="30px"
            textAlign="center"
            color="primary.main"
            mb={2}
          >
            Warning!
          </DialogTitle>
          <DialogContent>
            <DialogContentText
              id="dialog-description"
              color="secondary.main"
              fontWeight="bold"
              fontSize="20px"
              mb={2}
            >
              Are you sure you want to delete the question?
            </DialogContentText>
          </DialogContent>
          <DialogActions
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: "50px",
              marginBottom: "20px",
            }}
          >
            <Button
              variant="contained"
              color="secondary"
              onClick={handleClose3}
              sx={{ color: "white" }}
            >
              No
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={confirmDelete}
              sx={{ color: "white" }}
            >
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      )}
      <Paper
        className="question"
        sx={{
          padding: {
            xs: "15px",
            sm: "8px",
            md: "15px",
          },
        }}
      >
        <Stack spacing={2}>
          <Stack
            spacing={2}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Stack spacing={2} direction="row" alignItems="center">
              <Avatar
                alt={studentName}
                sx={{ width: 48, height: 48 }}
                src={studentAvatar || ""}
              />
              <Stack spacing={0} direction="column">
                <Typography variant="h5" fontWeight="bold">
                  {studentName}
                </Typography>
                <Typography variant="subtitle1" color="grey">
                  {calculateDate(questionDate)}
                </Typography>
              </Stack>
            </Stack>
            {studentId == Number(Cookies.get("id")) && (
              <IconButton id="question-menu-button" onClick={handleClick2}>
                <MoreVertIcon sx={{ fontSize: "30px" }} />
              </IconButton>
            )}
          </Stack>
          <Typography variant="subtitle1" fontSize={20}>
            {questionContent}
          </Typography>
          <Box
            height="300px"
            textAlign={{
              xs: "center",
              md: "start",
            }}
            overflow="hidden"
            width={{ xs: "350px", sm: "300px", md: "500px", lg: "700px" }}
            alignSelf={{ xs: "center", lg: "start" }}
          >
            <img
              className="question-image"
              src={imageURL as string}
              alt="question"
              width="100%"
              height="300px"
              style={{ objectFit: "contain" }}
            />
          </Box>
          <Box className="answers" mt={1}>
            <Typography variant="h5" mb={2} color="primary.main">
              <span style={{ marginRight: "5px" }}>
                {questionAnswers?.length}
              </span>
              Answers:
            </Typography>
            <Stack
              spacing={2}
              className="answers-wrapper"
              divider={<Divider />}
            >
              {displayedAnswers.map((a, i) => {
                return (
                  <Answer
                    key={i}
                    questionId={questionId}
                    answerId={a.answerId}
                    answerContent={a.answerContent}
                    answerDate={a.answerDate}
                    answerSumRating={a.answerSumRating}
                    numberOfRaters={a.numberOfRaters}
                    myRate={a.myRate}
                    studentId={a.studentId}
                    studentName={a.studentName}
                    studentAvatar={a.studentAvatar}
                    changeRating={changeRating}
                    removeAnswer={removeAnswer}
                    openMustLoginPopup={openMustLoginPopup}
                  />
                );
              })}
              <Stack direction="row" alignItems="center" spacing={1}>
                <textarea
                  ref={textAreaRef}
                  placeholder="Add an answer..."
                  className="add-answer-input"
                  rows={4}
                />
                <IconButton
                  sx={{
                    color: "primary.main",
                    fontWeight: "bold",
                    transition: ".6s",
                    width: "45px",
                    height: "45px",
                    backgroundColor: "#ddd",
                    "&:hover": {
                      bgcolor: "secondary.main",
                    },
                  }}
                  onClick={handleClick}
                >
                  <SendIcon sx={{ fontSize: "25px", fontWeight: "bold" }} />
                </IconButton>
              </Stack>
              {questionAnswers.length > 3 &&
                (hasReachedMaxAnswers ? (
                  <Button
                    onClick={showLessAnswers}
                    variant="contained"
                    color="primary"
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      marginTop: "20px",
                      width: "150px",
                      alignSelf: {
                        xs: "center",
                        md: "start",
                      },
                    }}
                  >
                    Show less
                  </Button>
                ) : (
                  <Button
                    onClick={getMoreAnswers}
                    variant="contained"
                    color="primary"
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      marginTop: "20px",
                      width: "150px",
                      alignSelf: {
                        xs: "center",
                        md: "start",
                      },
                    }}
                  >
                    View More
                  </Button>
                ))}
            </Stack>
          </Box>
        </Stack>
        <Menu
          id="question-menu"
          anchorEl={anchorEl}
          open={open}
          MenuListProps={{
            "aria-labelledby": "question-menu-button",
          }}
          onClose={handleClose2}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          sx={{
            "& li": {
              width: "200px",
            },
          }}
        >
          <MenuItem>
            <LoadingButton
              variant="text"
              sx={{ color: "black" }}
              loading={loading}
              disabled={updateQuestionDisabled}
              startIcon={<EditIcon />}
            >
              Update Question
            </LoadingButton>
          </MenuItem>
          <MenuItem>
            <LoadingButton
              variant="text"
              sx={{ color: "black" }}
              loading={loading2}
              startIcon={<DeleteIcon />}
              onClick={openConfirmDeletePopUp}
            >
              Remove Question
            </LoadingButton>
          </MenuItem>
        </Menu>
      </Paper>
    </>
  );
};
