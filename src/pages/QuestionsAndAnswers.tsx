import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import axios from "axios";
import Cookies from "js-cookie";

import "../components/Q&A/q&a.css";

import {
  Box,
  Stack,
  Typography,
  Toolbar,
  Button,
  Paper,
  Snackbar,
  Skeleton,
} from "@mui/material";

import { Question } from "../components/Q&A/Question";
import { AddQuestionComponent } from "../components/Q&A/AddQuestionComponent";
import { QuestionsAndAnswersHeader } from "../components/Q&A/QuestionsAndAnswersHeader";
import SideBar from "../components/Q&A/Side Bar/SideBar";
import { SnackbarAlert } from "../components/custom snack bar/SnackbarAlert";
import NoContentFound from "../components/No Content found/NoContentFound";
import LoadingIndicator from "../components/Loading Indicator/LoadingIndicator";
import { MustLoginPopup } from "./MustLoginPopup";
import { SearchQuestionPopup } from "../components/Q&A/SearchQuestionPopup";
import "../components/Loading Indicator/loadingIndicator.css";

import InfiniteScroll from "react-infinite-scroll-component";

export type chapterType = {
  chapterId: number;
  chapterName: string;
  isActive: boolean;
};

export type coursesType = {
  courseId: number;
  courseName: string;
  courseChapters: chapterType[];
}[];

export type activeChapterType = {
  courseId: number;
  courseName: string;
  chapterId: number;
  chapterNumber: number;
  chapterName: string;
} | null;

export type serverResponseType = {
  status: "success" | "error" | undefined | "warning";
  message: string;
};

export type question = {
  questionId: number;
  questionContent: string;
  questionDate: string;
  imageURL: string | null;
  isModified: number;
  studentId: number;
  studentName: string;
  studentAvatar: string | null;
  questionAnswers: answersType;
};

export type questions = question[];

export type questionType = question & {
  questionFrom: "search" | "normal"; // This prop to specify if the displayed question from the search result or the page
  // in order when the user edit the question or remove it i should remove it from the search result or from the page
  editQuestion: (props: {
    questionId: number;
    questionContent: string;
    imageURL: string;
    whereToEditQuestion: "search" | "normal";
  }) => void;
  removeQuestion: (props: {
    questionId: number;
    whereToRemoveQuestion: "search" | "normal";
  }) => void;
  addAnswer: (props: {
    questionId: number;
    questionAnswers: answersType;
    whereToAddAnswer: "search" | "normal";
  }) => void;
  updateAnswer: (props: {
    questionId: number;
    answerId: number;
    answerContent: string;
    whereToUpdateAnswer: "search" | "normal";
  }) => void;
  removeAnswer: (props: {
    questionId: number;
    answerId: number;
    whereToRemoveAnswer: "search" | "normal";
  }) => void;
  setisSnackbarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setsnackbarContent: React.Dispatch<React.SetStateAction<serverResponseType>>;
  openMustLoginPopup: () => void;
  handleChangeRating: (props: handleChangeRatingPropsType) => void;
};

export type searchedQuestion = question & {
  courseName: string;
  chapterName: string;
};

export type searchedQuestions = searchedQuestion[];

export type answerType = {
  questionId: number;
  answerId: number;
  answerContent: string;
  answerDate: string;
  answerSumRating: number;
  numberOfRaters: number;
  myRate: number;
  studentId: number;
  studentName: string | null;
  studentAvatar: string | null;
};

export type answersType = answerType[];

export type answerProps = answerType & {
  questionFrom: "search" | "normal";
  changeRating: (props: {
    answerId: number;
    myRate: number;
    answerSumRating: number;
    numberOfRaters: number;
    whereToUpdateRating: "search" | "normal";
  }) => void;
  updateAnswer: (props: {
    questionId: number;
    answerId: number;
    answerContent: string;
    whereToUpdateAnswer: "search" | "normal";
  }) => void;
  removeAnswer: (props: {
    questionId: number;
    answerId: number;
    whereToRemoveAnswer: "search" | "normal";
  }) => void;
  openMustLoginPopup: () => void;
};

export type handleChangeRatingPropsType = {
  whereToUpdateRating: "search" | "normal";
  questionId: number;
  answerId: number;
  myRate: number;
  answerSumRating: number;
  numberOfRaters: number;
};

export const QuestionsAndAnswers = () => {
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  // This state is in case a student searches for a specific question
  const [isLoading, setisLoading] = useState<boolean>(false);

  // This state is for fetching the courses
  const [isFetching, setisFetching] = useState<boolean>(true);

  // This state is when the user searches for a question that doesn't exist
  const [noContentFound, setnoContentFound] = useState<boolean>(false);

  const [courses, setcourses] = useState([] as coursesType);

  const [activeChapter, setactiveChapter] = useState<activeChapterType>(null);

  const [questions, setquestions] = useState<questions>([]);

  const [hasMoreQuestions, sethasMoreQuestions] = useState<boolean>(true);

  const [isAskQuestionOpen, setisAskQuestionOpen] = useState<boolean>(false);

  const [isSnackbarOpen, setisSnackbarOpen] = useState<boolean>(false);

  const [snackbarContent, setsnackbarContent] = useState<serverResponseType>({
    status: undefined,
    message: "",
  });

  const [searchedQuestionsResult, setsearchedQuestionsResult] =
    useState<searchedQuestions>([]);

  const [searchedQuestions, setsearchedQuestions] = useState<questions>([]);

  const [searchPopUpOpen, setsearchPopUpOpen] = useState<boolean>(false);

  const [isMustLoginPopupOpen, setisMustLoginPopupOpen] =
    useState<boolean>(false);

  console.log(questions);

  // I am using location here to extract the id of the class to fetch its data. if id is null (default classId: 1)

  const location = useLocation();

  // The class_id might be null in case the user head to the link of Q&A directly (I'm getting the class id from the route of choosing the class.) so I'm defining a default class id which is 1

  let class_id: number | null = null;

  if (location.state !== null) class_id = location.state.class_id;

  useEffect(() => {
    const fetchCourses = async () => {
      const class_i = class_id === null ? 1 : class_id;
      const res = await axios.get(
        "http://localhost/Ma-rifah/fetch_courses.php?id=" + class_i
      );
      setisFetching(false);
      // console.log(res.data);
      setcourses(res.data);
      // setting the first chapter of the active course as an active chapter
      setactiveChapter({
        courseId: res.data[0].courseId,
        courseName: res.data[0].courseName,
        chapterId: res.data[0].courseChapters[0].chapterId,
        chapterNumber: 1,
        chapterName: res.data[0].courseChapters[0].chapterName,
      });
    };

    fetchCourses();
  }, [class_id]);

  // After the user changes the chapter. Questions of the new chapters will be fetched in this function.
  useEffect(() => {
    if (activeChapter === null) return;
    const fetchQuestionsAndAnswers = async () => {
      setisLoading(true);

      const studentId =
        Cookies.get("id") == undefined ? null : Number(Cookies.get("id"));

      console.log(activeChapter);

      const res = await axios.post(
        "http://localhost/Ma-rifah/get_questions_answers.php",
        {
          studentId,
          chapterId: activeChapter.chapterId,
        }
      );

      console.log(res.data);

      if (res?.data.length === 0) {
        setnoContentFound(true);
        setquestions([]);
      } else {
        setnoContentFound(false);
        setquestions(res?.data);
      }

      setisLoading(false);
    };

    fetchQuestionsAndAnswers();
  }, [activeChapter]);

  const getMoreQuestions = async () => {
    const fetchQuestionsAndAnswers = async () => {
      let studentId;

      if (Cookies.get("id") == undefined) studentId = null;
      else studentId = Number(Cookies.get("id"));

      try {
        const res = await axios.post(
          "http://localhost/Ma-rifah/get_more_questions.php",
          {
            start: questions.length,
            limit: 5,
            studentId,
            chapterId: activeChapter?.chapterId,
          }
        );

        if (res.data.status === "success" && res.data.payload.length > 0) {
          const newFetchedQuestions = res.data.payload;

          const indexOfExistingQuestions: number[] = [];

          newFetchedQuestions.forEach((q: question, index: number) => {
            for (let i = 0; i < questions.length; i++) {
              if (questions[i].questionId === Number(q.questionId)) {
                indexOfExistingQuestions.push(index);
              }
            }
          });

          if (indexOfExistingQuestions.length > 0) {
            indexOfExistingQuestions.forEach((e) => {
              newFetchedQuestions.splice(e, 1);
            });
          }

          if (newFetchedQuestions.length > 0)
            setquestions([...questions, ...newFetchedQuestions]);
          else sethasMoreQuestions(false);
        } else if (
          res.data.status === "success" &&
          res.data.payload.length === 0
        ) {
          sethasMoreQuestions(false);
        } else {
          setisSnackbarOpen(true);
          setsnackbarContent({
            status: res.data.status,
            message: res.data.message,
          });
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        setisSnackbarOpen(true);
        setsnackbarContent({
          status: "error",
          message: error.message,
        });
      }
    };

    fetchQuestionsAndAnswers();
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // When the user wants to display questions about another course or chapter.
  const changeActiveChapter = (props: activeChapterType) => {
    if (activeChapter?.chapterId === props?.chapterId) return;
    setactiveChapter(props);
  };

  const handleAskQuestion = () => {
    if (Cookies.get("id") !== undefined) setisAskQuestionOpen(true);
    else setisMustLoginPopupOpen(true);
  };

  const addQuestion = (newQuestion: question) => {
    const qu = Array.from(questions);
    qu.unshift(newQuestion);
    setquestions(qu);
    setnoContentFound(false);
  };

  const editQuestion = (props: {
    questionId: number;
    questionContent: string;
    imageURL: string;
    whereToEditQuestion: "search" | "normal";
  }) => {
    const { questionId, questionContent, imageURL, whereToEditQuestion } =
      props;
    const qu =
      whereToEditQuestion === "search"
        ? Array.from(searchedQuestions)
        : Array.from(questions);

    qu.forEach((q) => {
      if (q.questionId == questionId) {
        q.questionContent = questionContent;
        q.imageURL = imageURL;
        q.isModified = 1;
        return;
      }
    });

    whereToEditQuestion === "search"
      ? setsearchedQuestions(qu)
      : setquestions(qu);
  };

  const removeQuestion = (props: {
    questionId: number;
    whereToRemoveQuestion: "search" | "normal";
  }) => {
    const { questionId, whereToRemoveQuestion } = props;

    const oldQuestions =
      whereToRemoveQuestion === "search"
        ? Array.from(searchedQuestions)
        : Array.from(questions);

    const newQuestions = oldQuestions.filter((q) => q.questionId != questionId);

    whereToRemoveQuestion === "search"
      ? setsearchedQuestions(newQuestions)
      : setquestions(newQuestions);

    if (newQuestions.length === 0 && whereToRemoveQuestion === "normal")
      setnoContentFound(true);

    if (whereToRemoveQuestion === "search") {
      const oldSearchedQuestionsResult = Array.from(searchedQuestionsResult);
      const newSearchedQuestionsResult = oldSearchedQuestionsResult.filter(
        (q) => q.questionId !== questionId
      );
      setsearchedQuestionsResult(newSearchedQuestionsResult);
      if (newSearchedQuestionsResult.length === 0) {
        setsearchedQuestionsResult([]);
      }
    }
  };

  const handleSelectSearchQuestion = (question: searchedQuestion) => {
    // In this method we need to get the selected search question in the begining

    const qu = Array.from(searchedQuestionsResult);

    const qu2 = qu.filter((q) => q.questionId !== question.questionId);

    qu2.unshift(question);

    setsearchedQuestions(qu2);

    setsearchPopUpOpen(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleOpenSearchPopUp = () => {
    setsearchPopUpOpen(true);
  };

  const handleCloseSearchPopUp = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setsearchPopUpOpen(false);
  };

  const addAnswer = (props: {
    questionId: number;
    questionAnswers: answersType;
    whereToAddAnswer: "search" | "normal";
  }) => {
    const { questionId, questionAnswers, whereToAddAnswer } = props;

    const qu =
      whereToAddAnswer === "search"
        ? Array.from(searchedQuestions)
        : Array.from(questions);

    let indexOfQuestion = 0;
    qu.forEach((q, i) => {
      if (q.questionId === questionId) {
        indexOfQuestion = i;
        return;
      }
    });
    qu[indexOfQuestion].questionAnswers = questionAnswers;
    whereToAddAnswer === "search" ? setsearchedQuestions(qu) : setquestions(qu);
  };

  const updateAnswer = (props: {
    questionId: number;
    answerId: number;
    answerContent: string;
    whereToUpdateAnswer: "search" | "normal";
  }) => {
    const { questionId, answerId, answerContent, whereToUpdateAnswer } = props;

    const qu =
      whereToUpdateAnswer === "search"
        ? Array.from(searchedQuestions)
        : Array.from(questions);

    qu.forEach((q) => {
      if (q.questionId == questionId) {
        q.questionAnswers.forEach((a) => {
          if (a.answerId == answerId) {
            a.answerContent = answerContent;
          }
        });
      }
    });

    whereToUpdateAnswer === "search"
      ? setsearchedQuestions(qu)
      : setquestions(qu);
  };

  const removeAnswer = (props: {
    questionId: number;
    answerId: number;
    whereToRemoveAnswer: "search" | "normal";
  }) => {
    const { questionId, answerId, whereToRemoveAnswer } = props;

    const qu =
      whereToRemoveAnswer === "search"
        ? Array.from(searchedQuestions)
        : Array.from(questions);
    let newAnswers = [];

    qu.forEach((q) => {
      if (q.questionId == questionId) {
        newAnswers = q.questionAnswers.filter((a) => a.answerId != answerId);
        q.questionAnswers = newAnswers;
      }
    });

    whereToRemoveAnswer === "search"
      ? setsearchedQuestions(qu)
      : setquestions(qu);
  };

  // Close snackbar
  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setisSnackbarOpen(false);
  };

  const openMustLoginPopup = () => {
    setisMustLoginPopupOpen(true);
  };

  // When the student wants to add / remove / update rating of an answer.
  const handleChangeRating = (props: handleChangeRatingPropsType) => {
    const {
      questionId,
      answerId,
      myRate,
      answerSumRating,
      numberOfRaters,
      whereToUpdateRating,
    } = props;

    const h =
      whereToUpdateRating === "search"
        ? Array.from(searchedQuestions)
        : Array.from(questions);

    h.forEach((q, k) => {
      if (q.questionId == questionId) {
        q.questionAnswers.forEach((a, i) => {
          if (a.answerId == answerId) {
            h[k].questionAnswers[i] = {
              ...a,
              myRate: myRate,
              answerSumRating: answerSumRating,
              numberOfRaters: numberOfRaters,
            };
          }
        });
      }
    });

    whereToUpdateRating === "search"
      ? setsearchedQuestions(h)
      : setquestions(h);
  };

  return (
    <Box sx={{ display: "flex" }} className="questions-page">
      <QuestionsAndAnswersHeader
        handleDrawerToggle={handleDrawerToggle}
        handleOpenSearchPopUp={handleOpenSearchPopUp}
      />
      <SideBar
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
        isLoading={isFetching}
        courses={courses}
        activeChapter={activeChapter}
        changeActiveChapter={changeActiveChapter}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: {
            xs: 1,
            md: 3,
          },
        }}
        className="questions-content"
      >
        <Toolbar />

        {searchedQuestions.length > 0 ? (
          <Box>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h4" color="primary">
                Search Results:
              </Typography>
              <Button
                variant="contained"
                sx={{ color: "white" }}
                onClick={() => setsearchedQuestions([])}
              >
                Clear Results
              </Button>
            </Stack>

            <Stack className="questions-wrapper" mt={2} spacing={2}>
              {searchedQuestions.map((q) => (
                <Question
                  key={`question_${q.questionId}`}
                  questionFrom="search"
                  questionId={q.questionId}
                  questionContent={q.questionContent}
                  questionDate={q.questionDate}
                  isModified={q.isModified}
                  studentId={q.studentId}
                  studentName={q.studentName}
                  studentAvatar={q.studentAvatar}
                  imageURL={q.imageURL}
                  questionAnswers={q.questionAnswers}
                  editQuestion={editQuestion}
                  removeQuestion={removeQuestion}
                  addAnswer={addAnswer}
                  updateAnswer={updateAnswer}
                  removeAnswer={removeAnswer}
                  setisSnackbarOpen={setisSnackbarOpen}
                  setsnackbarContent={setsnackbarContent}
                  openMustLoginPopup={openMustLoginPopup}
                  handleChangeRating={handleChangeRating}
                />
              ))}
            </Stack>
          </Box>
        ) : isFetching ? (
          <LoadingComponent />
        ) : (
          <Box>
            <Typography
              variant="h2"
              color="secondary.main"
              className="main-title"
              sx={{
                margin: "10px auto 40px",
                fontSize: {
                  xs: "40px",
                  sm: "60px",
                },
              }}
            >
              {activeChapter?.courseName}
            </Typography>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography
                variant="h4"
                color="primary.main"
                fontWeight="bold"
                sx={{
                  fontSize: {
                    xs: "22px",
                    sm: "30px",
                  },
                }}
              >
                <span style={{ marginRight: "5px" }}>
                  Chapter {activeChapter?.chapterNumber}:
                </span>
                {activeChapter?.chapterName}
              </Typography>
              <Button
                onClick={handleAskQuestion}
                variant="contained"
                sx={{
                  color: "white",
                  fontSize: {
                    xs: "12px",
                    sm: "13px",
                  },
                }}
              >
                Ask Question
              </Button>
            </Stack>

            <Stack
              className="questions-wrapper"
              mt={2}
              spacing={2}
              sx={{
                "& .infinite-scroll-component": {
                  overflow: "hidden !important",
                },
              }}
            >
              {isLoading ? (
                <LoadingIndicator />
              ) : noContentFound ? (
                <NoContentFound
                  iconFontSize={200}
                  textFontSize={30}
                  seperateString={false}
                />
              ) : (
                <InfiniteScroll
                  dataLength={questions.length}
                  next={getMoreQuestions}
                  hasMore={hasMoreQuestions}
                  loader={
                    <Box overflow="hidden">
                      <LoadingIndicator />
                    </Box>
                  }
                  endMessage={
                    <p style={{ textAlign: "center", padding: "10px" }}>
                      No Questions Left
                    </p>
                  }
                >
                  {questions.map((q) => {
                    return (
                      <Question
                        key={`question_${q.questionId}`}
                        questionFrom="normal"
                        questionId={q.questionId}
                        questionContent={q.questionContent}
                        questionDate={q.questionDate}
                        isModified={q.isModified}
                        studentId={q.studentId}
                        studentName={q.studentName}
                        studentAvatar={q.studentAvatar}
                        imageURL={q.imageURL}
                        questionAnswers={q.questionAnswers}
                        editQuestion={editQuestion}
                        removeQuestion={removeQuestion}
                        addAnswer={addAnswer}
                        updateAnswer={updateAnswer}
                        removeAnswer={removeAnswer}
                        setisSnackbarOpen={setisSnackbarOpen}
                        setsnackbarContent={setsnackbarContent}
                        openMustLoginPopup={openMustLoginPopup}
                        handleChangeRating={handleChangeRating}
                      />
                    );
                  })}
                </InfiniteScroll>
              )}
            </Stack>
            {searchPopUpOpen && (
              <SearchQuestionPopup
                class_id={class_id}
                searchedQuestionsResult={searchedQuestionsResult}
                setsearchedQuestionsResult={setsearchedQuestionsResult}
                handleSelectSearchQuestion={handleSelectSearchQuestion}
                handleCloseSearchPopUp={handleCloseSearchPopUp}
              />
            )}
            {isAskQuestionOpen && (
              <AddQuestionComponent
                chapterId={activeChapter?.chapterId}
                operation="add question"
                addQuestion={addQuestion}
                onClose={() => setisAskQuestionOpen(false)}
                setisSnackbarOpen={setisSnackbarOpen}
                setsnackbarContent={setsnackbarContent}
              />
            )}
            {isSnackbarOpen && (
              <Snackbar
                open={isSnackbarOpen}
                autoHideDuration={3000}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              >
                <SnackbarAlert
                  onClose={handleClose}
                  severity={snackbarContent.status}
                  sx={{ padding: "12px 15px", fontSize: "17px" }}
                >
                  {snackbarContent && snackbarContent.message}
                </SnackbarAlert>
              </Snackbar>
            )}
            {isMustLoginPopupOpen && (
              <MustLoginPopup
                isMustLoginPopupOpen={isMustLoginPopupOpen}
                setisMustLoginPopupOpen={setisMustLoginPopupOpen}
              />
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default QuestionsAndAnswers;

// This is a component that renders while fetching chapters of the selected class

const LoadingComponent = () => {
  return (
    <Box>
      <Skeleton
        variant="rectangular"
        animation="wave"
        height={110}
        sx={{ margin: "10px 0px 20px" }}
      />
      <Skeleton
        variant="rectangular"
        animation="wave"
        height={45}
        sx={{ marginBottom: "30px" }}
      />

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
          <Stack spacing={1} direction="row" alignItems="center">
            <Skeleton
              variant="circular"
              animation="wave"
              height={40}
              width={40}
            />
            <Skeleton
              variant="rectangular"
              animation="wave"
              height={40}
              width={300}
            />
          </Stack>
          <Skeleton variant="rectangular" animation="wave" height={28} />
          <Skeleton
            variant="rectangular"
            animation="wave"
            height="300px"
            width="auto"

            // alignSelf={{ xs: "center", lg: "start" }}
          />
        </Stack>
      </Paper>
    </Box>
  );
};
