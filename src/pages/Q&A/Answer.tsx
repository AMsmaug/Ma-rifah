import { useState, useRef, useEffect } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { Avatar, Rating, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ReportIcon from "@mui/icons-material/Report";
import { LoadingButton } from "@mui/lab";
import { Dialog, DialogContent } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import { answerProps, CustomTextInput } from "./QuestionsAndAnswers";
import "./answer.css";

const calculateDate = (d: string) => {
  const dateNow = new Date();
  const dateBefore = new Date(d);
  const dateDiff: number = dateNow.getTime() - dateBefore.getTime();

  const minutesDiff = Math.floor(dateDiff / (1000 * 60));
  const hoursDiff = Math.floor(minutesDiff / 60);
  const daysDiff = Math.floor(hoursDiff / 24);
  const monthsDiff = Math.floor(daysDiff / 30);
  const yearsDiff = Math.floor(monthsDiff / 12);

  if (minutesDiff < 1) {
    return "just now";
  } else if (minutesDiff >= 1 && minutesDiff <= 59) {
    return `${minutesDiff} minute${minutesDiff === 1 ? "" : "s"}`;
  } else if (hoursDiff >= 1 && hoursDiff <= 23) {
    return `${hoursDiff} hour${hoursDiff === 1 ? "" : "s"}`;
  } else if (daysDiff >= 1 && daysDiff <= 29) {
    return `${daysDiff} day${daysDiff === 1 ? "" : "s"}`;
  } else if (monthsDiff >= 1 && monthsDiff <= 11) {
    return `${monthsDiff} month${monthsDiff === 1 ? "" : "s"}`;
  } else {
    return `${yearsDiff} year${yearsDiff === 1 ? "" : "s"}`;
  }
};

export const Answer = (props: answerProps) => {
  const {
    questionFrom,
    questionId,
    answerId,
    answerContent,
    answerDate,
    answerSumRating,
    numberOfRaters,
    myRate,
    studentId,
    studentName,
    studentAvatar,
    changeRating,
    updateAnswer,
    removeAnswer,
    openMustLoginPopup,
  } = props;

  const [value, setvalue] = useState<number | null>(null);
  const [avg, setavg] = useState<number>(0);
  const [nbRaters, setnbRaters] = useState<number>(0);
  const [sumRating, setsumRating] = useState<number>(0);

  const [updateAnswerPopUp, setupdateAnswerPopUp] = useState<boolean>(false);

  const [loadingDeletingAnswer, setloadingDeletingAnswer] =
    useState<boolean>(false);

  const [loadingUpdatingAnswer, setloadingUpdatingAnswer] =
    useState<boolean>(false);

  const [loadingReportingAnswer, setloadingReportingAnswer] =
    useState<boolean>(false);

  const [anchorEl, setanchorEl] = useState<HTMLElement | null>(null);

  const open = Boolean(anchorEl);

  const answerRef = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    setvalue(myRate === null || myRate == 0 ? null : Number(myRate));
    setnbRaters(numberOfRaters);
    setsumRating(answerSumRating);
    if (answerSumRating === null) setavg(0);
    else setavg(Number((answerSumRating / numberOfRaters).toFixed(1)));
  }, []);

  // change rating or rate or remove rate
  const handleChange = (
    _e: React.ChangeEvent<unknown>,
    newValue: number | null
  ) => {
    if (Cookies.get("id") !== undefined) {
      if (value !== null && newValue === null) {
        // It means that eh wants to remove his rate
        let newNbOfRaters = nbRaters;
        newNbOfRaters--;

        const newSumRating = sumRating - value;

        const newAverageRating = newSumRating / newNbOfRaters;

        changeRating({
          answerId,
          myRate: 0,
          numberOfRaters: newNbOfRaters,
          answerSumRating: newSumRating,
          whereToUpdateRating: questionFrom,
        });

        const props = {
          studentId: Cookies.get("id"),
          answerId,
        };

        axios.post("http://localhost/Ma-rifah/remove_rate.php", props);

        setsumRating(newSumRating);
        setavg(newAverageRating);
        setnbRaters(newNbOfRaters);
        setvalue(null);
      } else if (value !== null && newValue !== null) {
        // It means that he wants to update his rate
        console.log("Updating my rate");

        const newSumRating = Number(sumRating) + newValue - value;

        const newAvg = newSumRating / nbRaters;

        const newAverageRating = Number(newAvg.toFixed(1));

        changeRating({
          answerId,
          myRate: newValue,
          numberOfRaters: nbRaters,
          answerSumRating: newSumRating,
          whereToUpdateRating: questionFrom,
        });

        const inputs = {
          studentId: Cookies.get("id"),
          answerId,
          ratingValue: newValue,
        };

        axios.post("http://localhost:/Ma-rifah/update_rate.php", inputs);

        setvalue(newValue);
        setavg(newAverageRating);
        setsumRating(newSumRating);
      } else {
        // It means that he wants to add rate
        if (newValue !== null) {
          console.log("Inserting my rate");

          let newNbOfRaters = nbRaters;
          newNbOfRaters++;

          const newSumRating = Number(sumRating) + newValue;

          const newAverageRating = Number(
            (newSumRating / newNbOfRaters).toFixed(1)
          );

          changeRating({
            answerId,
            myRate: newValue | 0,
            numberOfRaters: newNbOfRaters,
            answerSumRating: newSumRating,
            whereToUpdateRating: questionFrom,
          });

          const props = {
            ratingValue: newValue,
            studentId: Cookies.get("id"),
            answerId,
          };

          axios.post("http://localhost/Ma-rifah/insert_rate.php", props);

          setvalue(newValue);
          setavg(newAverageRating);
          setsumRating(newSumRating);
          setnbRaters(newNbOfRaters);
        }
      }
    } else {
      openMustLoginPopup();
    }
  };

  // closing the menu item
  const handleClose = () => {
    setanchorEl(null);
  };

  // deleting answer
  const handleClick = () => {
    setloadingDeletingAnswer(true);

    axios
      .delete("http://localhost/Ma-rifah/remove_answer.php?id=" + answerId)
      .then((res) => {
        if (res.data.status === "success") {
          answerRef.current?.classList.add("removed");
          setanchorEl(null);

          setTimeout(() => {
            removeAnswer({
              questionId,
              answerId,
              whereToRemoveAnswer: questionFrom,
            });
          }, 500);

          setloadingDeletingAnswer(false);
        }
      })
      .catch((error) => console.log(error));
  };

  const openMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setanchorEl(event.currentTarget);
  };

  const openEditAnswerPopUp = () => {
    setupdateAnswerPopUp(true);
    setanchorEl(null);
  };

  const closeEditAnswerPopUp = () => {
    setupdateAnswerPopUp(false);
  };

  const handleReportAnswer = () => {
    setloadingReportingAnswer(true);
    setTimeout(() => {
      setloadingReportingAnswer(false);
    }, 2000);
  };

  return (
    <Stack ref={answerRef} className="answer" spacing={1}>
      {updateAnswerPopUp && (
        <Dialog
          aria-describedby="dialog-description"
          open={updateAnswerPopUp}
          onClose={closeEditAnswerPopUp}
          fullWidth
        >
          <DialogContent>
            <CustomTextInput
              questionFrom={questionFrom}
              questionId={questionId}
              answerId={answerId}
              text={answerContent}
              setloadingUpdatingAnswer={setloadingUpdatingAnswer}
              onClose={closeEditAnswerPopUp}
              updateAnswer={updateAnswer}
            />
          </DialogContent>
        </Dialog>
      )}
      {open &&
        // Checking if this answer is mine.
        (studentId == Number(Cookies.get("id")) ? (
          <Menu
            id="answer-menu"
            anchorEl={anchorEl}
            open={open}
            MenuListProps={{
              "aria-labelledby": "answer-menu-button",
            }}
            onClose={handleClose}
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
            <MenuItem onClick={openEditAnswerPopUp}>
              <LoadingButton
                variant="text"
                sx={{
                  color: "black",
                  fontSize: "12px",
                }}
                startIcon={<EditIcon />}
                loading={loadingUpdatingAnswer}
              >
                Update Answer
              </LoadingButton>
            </MenuItem>
            <MenuItem>
              <LoadingButton
                variant="text"
                sx={{
                  color: "black",
                  fontSize: "12px",
                }}
                startIcon={<DeleteIcon />}
                loading={loadingDeletingAnswer}
                onClick={handleClick}
              >
                Remove Answer
              </LoadingButton>
            </MenuItem>
          </Menu>
        ) : (
          <Menu
            id="answer-menu"
            anchorEl={anchorEl}
            open={open}
            MenuListProps={{
              "aria-labelledby": "answer-menu-button",
            }}
            onClose={handleClose}
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
                sx={{ color: "black", fontSize: "12px" }}
                startIcon={<ReportIcon />}
                loading={loadingReportingAnswer}
                onClick={handleReportAnswer}
              >
                Report Answer
              </LoadingButton>
            </MenuItem>
          </Menu>
        ))}

      <Stack direction="row" justifyContent="space-between">
        <Stack
          spacing={1.5}
          direction="row"
          justifyContent={{ xs: "center", md: "start" }}
          alignItems="center"
        >
          <Avatar src={studentAvatar || ""} />
          <Stack direction="column">
            <Typography variant="h6" fontWeight="bold">
              {studentName}
            </Typography>
            <Typography variant="subtitle2" color="grey">
              {calculateDate(answerDate) === "just now" ? (
                calculateDate(answerDate)
              ) : (
                <>{calculateDate(answerDate)} ago</>
              )}
            </Typography>
          </Stack>
        </Stack>
        <Box>
          <IconButton onClick={openMenu}>
            <MoreVertIcon />
          </IconButton>
        </Box>
      </Stack>
      <Stack
        spacing={1}
        direction={{
          xs: "column",
          md: "row",
        }}
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="subtitle1" fontSize={18} pl={2} flexBasis="80%">
          {answerContent}
        </Typography>
        <Stack textAlign="center">
          <Typography variant="subtitle1" fontSize={17} color="secondary">
            {!isNaN(avg) ? avg : 0} out of 5
          </Typography>
          <Rating
            onChange={handleChange}
            value={value}
            sx={{
              "& svg": {
                color: "var(--orange)",
              },
            }}
            size="large"
          />
        </Stack>
      </Stack>
    </Stack>
  );
};
