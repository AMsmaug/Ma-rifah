import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Button,
  Skeleton,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import QuizIcon from "@mui/icons-material/Quiz";
import { useContext, useEffect, useState } from "react";
import { CoursesContext } from "../Courses progress/CoursesContext";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

type chaptersType = {
  chapterId: number;
  chapterNumber: string;
  chapterName: string;
};

export const SideBar = () => {
  const {
    currentCourseId,
    setCurrentCourseId,
    currentChapterId,
    setCurrentChapterId,
    lastCompletedAssignment,
    setLastCompletedAssignment,
    lastCompletedQuiz,
    setLastCompletedQuiz,
  } = useContext(CoursesContext);
  const [chapters, setChapters] = useState<chaptersType[]>([]);
  const [openChapterDialaog, setOpenChapterDialaog] = useState(false);
  const [openQuizDialaog, setOpenQuizDialaog] = useState(false);
  const [openQuizWarnDialaog, setOpenQuizWarnDialaog] = useState(false);
  const [openExamDialaog, setOpenExamDialaog] = useState(false);
  const [openExamWarnDialaog, setOpenExamWarnDialaog] = useState(false);
  const [clickedChapter, setClickedChapter] = useState(0);
  const [chapterIdFromQuiz, setChapterIdFromQuiz] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  const navigate = useNavigate();

  useEffect(() => {
    if (!currentCourseId) {
      const currentPath = location.pathname;
      const courseFromPath = currentPath.substring(
        currentPath.lastIndexOf(`/`) + 1
      );
      axios
        .post(
          `http://localhost/Ma-rifah/courses_content/get_chapters_info.php`,
          {
            studentId: Cookies.get(`id`),
            courseName: courseFromPath,
          }
        )
        .then((response: { data: { course_id: number } }) => {
          setCurrentCourseId(response.data.course_id);
        });
    } else {
      axios
        .post(
          `http://localhost/Ma-rifah/courses_content/get_chapters_info.php`,
          currentCourseId
        )
        .then((response: { data: chaptersType[] }) => {
          setChapters(response.data);
          setCurrentChapterId(response.data[0].chapterId);
          const chapterIds: number[] = [];
          response.data.forEach((element) => {
            chapterIds.push(element.chapterId);
          });
          console.log(chapterIds);
          axios
            .post(
              `http://localhost/Ma-rifah/courses_content/check_assignment_work.php`,
              { chapterIds, studentId: Cookies.get(`id`) }
            )
            .then((response: { data: number }) => {
              console.log(response.data);
              setLastCompletedAssignment(response.data);
              // setLastCompletedAssignment(1);
            });
          axios
            .post(
              `http://localhost/Ma-rifah/courses_content/check_quiz_work.php`,
              { chapterIds, studentId: Cookies.get(`id`) }
            )
            .then((response: { data: number }) => {
              setLastCompletedQuiz(response.data);
              console.log(response.data);
              // setLastCompletedQuiz(0);
            });
          setIsLoading(false);
        });
    }
  }, [
    currentCourseId,
    location,
    setCurrentCourseId,
    setCurrentChapterId,
    setLastCompletedAssignment,
    setLastCompletedQuiz,
  ]);

  const loadingBoxes = (nbOfBoxes: number) => {
    const boxes = [];
    for (let i = 0; i < nbOfBoxes; i++) {
      boxes.push(
        <Skeleton
          key={i}
          variant="rectangular"
          width={"calc(100% - 20px)"}
          height={`50px`}
          animation="wave"
          sx={{ margin: "0 10px 15px 10px", borderRadius: `12px` }}
        />
      );
    }
    return boxes;
  };

  return (
    <Box
      sx={{
        boxShadow: `0 0 10px #777`,
        height: `calc(100vh - 64px)`,
        display: {
          xs: `none`,
          md: `block`,
          lg: `block`,
          xg: `block`,
        },
        minWidth: `300px`,
        width: `300px`,
        position: "sticky",
        top: `64px`,
      }}
    >
      <List sx={{ paddingTop: `20px` }}>
        {isLoading
          ? loadingBoxes(4)
          : chapters
          ? chapters.map((chapter) => {
              return (
                <ListItem
                  disablePadding
                  key={chapter.chapterId}
                  color="primary"
                  sx={{
                    backgroundColor:
                      currentChapterId === chapter.chapterId ? "#0000000a" : "",
                    marginBottom: "10px",
                  }}
                >
                  <ListItemButton
                    onClick={() => {
                      if (
                        +chapter.chapterNumber === 1 &&
                        lastCompletedAssignment === 0
                      ) {
                        return;
                      } else {
                        if (
                          +chapter.chapterNumber >
                            lastCompletedAssignment + 1 ||
                          +chapter.chapterNumber > lastCompletedQuiz + 1
                        ) {
                          setOpenChapterDialaog(true);
                          setClickedChapter(+chapter.chapterNumber);
                        } else {
                          setCurrentChapterId(chapter.chapterId);
                        }
                      }
                    }}
                  >
                    <ListItemIcon>
                      <ArrowForwardIosIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      sx={{ marginLeft: "-15px" }}
                      primary={`Chapter ${chapter.chapterNumber}: ${chapter.chapterName}`}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })
          : null}
      </List>
      <Box
        height={2}
        bgcolor={`#777`}
        width={`90%`}
        margin={`15px auto 15px`}
      />
      <List>
        {isLoading
          ? loadingBoxes(3)
          : chapters
          ? chapters.map((chapter) => {
              return (
                <ListItem disablePadding key={chapter.chapterId}>
                  <ListItemButton
                    onClick={() => {
                      if (
                        +chapter.chapterNumber > lastCompletedQuiz + 1 ||
                        +chapter.chapterNumber === lastCompletedAssignment + 1
                      ) {
                        setOpenQuizDialaog(true);
                        setClickedChapter(+chapter.chapterNumber);
                      } else {
                        if (+chapter.chapterNumber > lastCompletedQuiz) {
                          setChapterIdFromQuiz(chapter.chapterId);
                          setOpenQuizWarnDialaog(true);
                        } else {
                          // the quiz is already done
                          setCurrentChapterId(chapter.chapterId);
                          navigate(`Quiz`, {
                            state: {
                              number: chapter.chapterNumber,
                              name: chapter.chapterName,
                            },
                          });
                        }
                      }
                    }}
                  >
                    <ListItemIcon>
                      <QuizIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={`Quiz ${chapter.chapterNumber}`} />
                  </ListItemButton>
                </ListItem>
              );
            })
          : null}
      </List>
      <Button
        sx={{
          color: `primary`,
          bgcolor: "secondary.main",
          width: `90%`,
          "&:hover": {
            color: `primary`,
            bgcolor: `secondary.dark`,
          },
          margin: `30px 15px`,
          borderRadius: `16px`,
          fontSize: `16px`,
        }}
        onClick={() => {
          if (lastCompletedQuiz < chapters.length) {
            setOpenExamDialaog(true);
          } else {
            setOpenExamWarnDialaog(true);
          }
        }}
      >
        final exam
      </Button>
      <Dialog
        open={openChapterDialaog}
        onClose={() => setOpenChapterDialaog(false)}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
        PaperProps={{
          style: {
            backgroundColor: "#13213c",
            borderRadius: "12px",
            padding: "20px",
          },
        }}
      >
        <DialogContent>
          <DialogContentText
            id="dialog-description"
            sx={{ color: "white", fontSize: 18, lineHeight: 1.8 }}
          >
            You cannot go to chapter {clickedChapter} unless you have completed
            both quiz {clickedChapter - 1} and the chapter {clickedChapter - 1}{" "}
            assignments!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenChapterDialaog(false)}
            color="primary"
            sx={{ marginRight: "auto" }}
          >
            {"<<< "}Back
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openQuizDialaog}
        onClose={() => setOpenQuizDialaog(false)}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
        PaperProps={{
          style: {
            backgroundColor: "#13213c",
            borderRadius: "12px",
            padding: "20px",
          },
        }}
      >
        <DialogContent>
          <DialogContentText
            id="dialog-description"
            sx={{ color: "white", fontSize: 18, lineHeight: 1.8 }}
          >
            {clickedChapter === lastCompletedAssignment + 1 &&
            clickedChapter === lastCompletedQuiz + 1
              ? `You must finish the chapter ${
                  lastCompletedAssignment + 1
                } assignments first!`
              : `You must take quiz ${clickedChapter - 1} first!`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenQuizDialaog(false)}
            color="primary"
            sx={{ marginRight: "auto" }}
          >
            {"<<< "}Back
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openQuizWarnDialaog}
        onClose={() => setOpenQuizWarnDialaog(false)}
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
            Once you started a quiz, a timer will start counting down and you
            cannot leave it without completing it, otherwise your response won't
            be submitted.
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
            Are you sure you want to take it?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenQuizWarnDialaog(false)}
            sx={{
              color: "white",
              backgroundColor: "red",
              margin: "0 auto",
              "&:hover": {
                backgroundColor: `#9d0101`,
              },
            }}
          >
            No
          </Button>
          <Button
            onClick={() => {
              // take me to the quiz
              setOpenQuizWarnDialaog(false);
              console.log(`chapterIdFromQuiz :`, chapterIdFromQuiz);
              setCurrentChapterId(chapterIdFromQuiz);
              const currenctChapter = chapters.filter(
                (chapter) => chapter.chapterId === chapterIdFromQuiz
              )[0];
              console.log(
                `current chapter Id from sideBar: `,
                currenctChapter.chapterId
              );
              navigate(`Quiz`, {
                state: {
                  number: currenctChapter.chapterNumber,
                  name: currenctChapter.chapterName,
                },
              });
            }}
            sx={{
              color: "white",
              backgroundColor: "green",
              margin: "0 auto",
              "&:hover": {
                backgroundColor: `#035d03`,
              },
            }}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openExamDialaog}
        onClose={() => setOpenExamDialaog(false)}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
        PaperProps={{
          style: {
            backgroundColor: "#13213c",
            borderRadius: "12px",
            padding: "20px",
          },
        }}
      >
        <DialogContent>
          <DialogContentText
            id="dialog-description"
            sx={{ color: "white", fontSize: 18, lineHeight: 1.8 }}
          >
            You must finish all the quizzes in order to take the final exam!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenExamDialaog(false)}
            color="primary"
            sx={{ marginRight: "auto" }}
          >
            {"<<< "}Back
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openExamWarnDialaog}
        onClose={() => setOpenExamWarnDialaog(false)}
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
          You are great!
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="dialog-description"
            sx={{ color: "secondary.dark", fontSize: 17, lineHeight: 1.8 }}
          >
            You have successfully completed all the chapters! You are now
            allowed to take the final exam. One more setp stands between you and
            completing the course.
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
            Are you sure you want to take the final exam?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenExamWarnDialaog(false)}
            sx={{
              color: "white",
              backgroundColor: "red",
              margin: "0 auto",
              "&:hover": {
                backgroundColor: `#9d0101`,
              },
            }}
          >
            No
          </Button>
          <Button
            onClick={() => {
              setOpenExamWarnDialaog(false);
              // take me to the final exam
            }}
            sx={{
              color: "white",
              backgroundColor: "green",
              margin: "0 auto",
              "&:hover": {
                backgroundColor: `#035d03`,
              },
            }}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
