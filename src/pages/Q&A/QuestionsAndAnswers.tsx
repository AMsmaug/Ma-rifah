import { useState, useRef, useEffect, forwardRef, useContext } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import SideBar from "../../components/Side Bar/SideBar";
import SearchIcon from "@mui/icons-material/Search";
import "./q&a.css";
import InfiniteScroll from "react-infinite-scroll-component";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Avatar,
  Button,
  Divider,
  Paper,
  Rating,
  Menu,
  MenuItem,
  Snackbar,
  Alert,
  AlertProps,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ReportIcon from "@mui/icons-material/Report";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PublishIcon from "@mui/icons-material/Publish";
import CancelIcon from "@mui/icons-material/Cancel";

import { LoadingButton } from "@mui/lab";

import { ActiveContext } from "../../components/Auth/UserInfo";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";

import NoContentFound from "../../components/No Content found/NoContentFound";
import LoadingIndicator from "../../components/Loading Indicator/LoadingIndicator";
import Skeleton from "@mui/material/Skeleton";
import axios from "axios";
import Cookies from "js-cookie";

// eslint-disable-next-line react-refresh/only-export-components
export const calculateDate = (d: string) => {
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

type chapterType = {
  chapterId: number;
  chapterName: string;
  isActive: boolean;
};

type coursesType = {
  courseId: number;
  courseName: string;
  courseChapters: chapterType[];
}[];

type activeChapterType = {
  courseId: number;
  courseName: string;
  chapterId: number;
  chapterNumber: number;
  chapterName: string;
} | null;

type serverResponseType = {
  status: "success" | "error" | undefined | "warning";
  message: string;
};

type question = {
  questionId: number;
  questionContent: string;
  questionDate: string;
  imageURL: string | null;
  studentId: number;
  studentName: string;
  studentAvatar: string | null;
  // chapterId: number;
  questionAnswers: answersType;
};

type questions = question[];

type questionType = question & {
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

type answerType = {
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

type answerProps = answerType & {
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

type handleChangeRatingPropsType = {
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
    useState<questions>([]);

  const [searchedQuestions, setsearchedQuestions] = useState<questions>([]);

  const [searchPopUpOpen, setsearchPopUpOpen] = useState<boolean>(false);

  const [searchNoContentFound, setsearchNoContentFound] =
    useState<boolean>(false);

  const [isSearchQuestionsLoading, setisSearchQuestionsLoading] =
    useState<boolean>(false);

  const [isMustLoginPopupOpen, setisMustLoginPopupOpen] =
    useState<boolean>(false);

  const searchPopUpRef = useRef<HTMLDivElement>(null!);
  const searchInputRef = useRef<HTMLInputElement>(null!);

  console.log(questions);

  // I am using location here to extract the id of the class to fetch its data. if id is null (default classId: 1)

  const location = useLocation();
  const navigate = useNavigate();

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

      let studentId;

      if (Cookies.get("id") == undefined) studentId = null;
      else studentId = Number(Cookies.get("id"));

      const res = await axios.post(
        "http://localhost/Ma-rifah/get_questions_answers.php",
        {
          studentId: studentId,
          chapterId: activeChapter.chapterId,
        }
      );

      console.log(res.data);

      setisLoading(false);

      if (res?.data.length === 0) setnoContentFound(true);
      else setnoContentFound(false);
      setquestions(res?.data);
    };

    fetchQuestionsAndAnswers();
  }, [activeChapter]);

  const getMoreQuestions = async () => {
    const fetchQuestionsAndAnswers = async () => {
      let studentId;

      if (Cookies.get("id") == undefined) studentId = null;
      else studentId = Number(Cookies.get("id"));

      const res = await axios.post(
        "http://localhost/Ma-rifah/get_more_questions.php",
        {
          start: questions.length,
          limit: 5,
          studentId,
          chapterId: activeChapter?.chapterId,
        } // Adjust these values based on your requirements
      );

      console.log(res.data);

      if (res.data.length > 0) setquestions([...questions, ...res.data]);
      else sethasMoreQuestions(false);
    };

    fetchQuestionsAndAnswers();
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navigateHome = () => {
    navigate("/");
  };

  const navigateLoginPage = () => {
    navigate("/login?src=QA");
  };

  // When the user wants to display questions about another another course or chapter.
  const changeActiveChapter = (props: activeChapterType) => {
    // if (activeChapter?.chapterId === props?.chapterId) return;
    setactiveChapter(props);
    sethasMoreQuestions(true);
    setsearchedQuestions([]);
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
        setsearchNoContentFound(true);
        setsearchedQuestionsResult([]);
      }
    }
  };

  const handleSearch = async () => {
    const enteredString = searchInputRef.current.value;

    setisSearchQuestionsLoading(true);

    const stdId = Cookies.get("id");

    let inputs;

    console.log(class_id);

    if (stdId === null || stdId === undefined) {
      inputs = {
        enteredString,
        classId: class_id === null ? 1 : class_id,
        studentId: null,
      };
    } else {
      inputs = {
        enteredString,
        classId: class_id === null ? 1 : class_id,
        studentId: stdId,
      };
    }

    const res = await axios.post(
      "http://localhost/Ma-rifah/search_question.php",
      inputs
    );

    setisSearchQuestionsLoading(false);

    console.log(res.data);

    if (res.data.length === 0) {
      setsearchedQuestionsResult([]);
      setsearchNoContentFound(true);
    } else {
      setsearchedQuestionsResult(res.data);
      setsearchNoContentFound(false);
    }
  };

  const handleSelectSearchQuestion = (question: question) => {
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

  const closeMustLoginPopup = () => {
    setisMustLoginPopupOpen(false);
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

  const handleLogout = () => {
    Cookies.remove("id");
    navigate("/login?src=QA");
  };

  return (
    <Box sx={{ display: "flex" }} className="questions-page">
      {/* start Search Pop up  */}
      {searchPopUpOpen && (
        <>
          <Box
            sx={{
              position: "fixed",
              zIndex: "1350",
              right: "0",
              bottom: "0",
              top: "0",
              left: "0",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                position: "fixed",
                right: "0",
                bottom: "0",
                top: "0",
                left: "0",
                backgroundColor: "#00000070",
                zIndex: "-1",
                backdropFilter: "blur(1.5px)",
              }}
            />
            <Stack
              sx={{
                backgroundColor: "#fff",
                color: "rgba(0, 0, 0, 0.87)",
                borderRadius: "5px",
                margin: {
                  xs: "0",
                  sm: "32px",
                },
                padding: "10px 15px ",
                position: "relative",
                boxShadow:
                  "0px 11px 15px -7px rgba(0,0,0,0.2), 0px 24px 38px 3px rgba(0,0,0,0.14), 0px 9px 46px 8px rgba(0,0,0,0.12)",
                width: {
                  xs: "100%",
                  sm: "500px",
                  md: "700px",
                  lg: "900px",
                },
                height: {
                  xs: "100%",
                  sm: "600px",
                },
              }}
              ref={searchPopUpRef}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  cursor: "pointer",
                  fontSize: "20px",
                }}
                onClick={handleCloseSearchPopUp}
              >
                <CancelIcon />
              </Box>
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                px={1}
                py={2}
                className="search-bar"
                borderBottom="1px solid #ccc"
                onClick={() => searchInputRef.current.focus()}
              >
                <SearchIcon
                  sx={{
                    margin: "0 !important",
                    fontSize: "30px",
                    color: "var(--dark-blue)",
                  }}
                />
                <input
                  type="text"
                  placeholder="Search..."
                  style={{ flex: "1", fontSize: "17px" }}
                  ref={searchInputRef}
                  autoFocus={true}
                />
              </Stack>
              <Stack flex={1} p={1} sx={{ overflowY: "auto" }}>
                {searchedQuestionsResult.length > 0 ? (
                  searchedQuestionsResult.map((s, i) => (
                    <Box
                      key={i}
                      sx={{
                        padding: "15px 5px 5px 5px ",
                        borderBottom: "1px solid #ccc",
                        transition: ".3s",
                        cursor: "pointer",
                        borderRadius: "6px",
                        "&:hover": {
                          border: "1px solid var(--orange)",
                          paddingLeft: "12px",
                          backgroundColor: "#FCA21159",
                          color: "var(--dark-blue)",
                          fontWeight: "500",
                        },
                      }}
                      onClick={() => handleSelectSearchQuestion(s)}
                    >
                      <Typography variant="subtitle1" fontWeight="500">
                        {s.questionContent}
                      </Typography>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        px={1}
                        mt={2}
                      >
                        <Stack direction="row" spacing={1}>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              color: "white",
                              backgroundColor: "grey",
                              padding: "0px 2px",
                              borderRadius: "6px",
                            }}
                          >
                            {s.courseName}
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              color: "white",
                              backgroundColor: "grey",
                              padding: "0px 2px",
                              borderRadius: "6px",
                            }}
                          >
                            {s.chapterName}
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              color: "white",
                              backgroundColor: "grey",
                              padding: "0px 2px",
                              borderRadius: "6px",
                            }}
                          >
                            Answers: {s.questionAnswers.length}
                          </Typography>
                        </Stack>

                        <Stack direction="row" alignItems="center">
                          <img src={s.studentAvatar} width="20px" />
                          <Typography
                            variant="subtitle2"
                            sx={{ color: "grey" }}
                            pl={1}
                          >
                            {s.studentName}
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            sx={{ color: "grey" }}
                            pl={2}
                          >
                            {s.questionDate}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Box>
                  ))
                ) : (
                  <Stack
                    justifyContent="center"
                    alignItems="center"
                    height="100%"
                  >
                    {searchNoContentFound ? (
                      <NoContentFound iconFontSize={130} textFontSize={20} />
                    ) : isSearchQuestionsLoading ? (
                      <LoadingIndicator />
                    ) : (
                      <>
                        <SearchIcon sx={{ fontSize: "70px", color: "grey" }} />
                        <Typography variant="subtitle1" color="grey">
                          Search For A Question
                        </Typography>
                      </>
                    )}
                  </Stack>
                )}
              </Stack>
              <Box pt={1} textAlign="center" borderTop="1px solid #ccc">
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "15px",
                    color: "white",
                    width: "40%",
                    display: "block",
                    margin: "0 auto",
                  }}
                  onClick={handleSearch}
                >
                  Search
                </Button>
              </Box>
            </Stack>
          </Box>
        </>
      )}
      {/* End Search Pop up */}

      <Toolbar
        sx={{
          position: "fixed",
          left: "0",
          top: "0",
          width: "100%",
          bgcolor: "secondary.main",
          color: "white",
          zIndex: "1300",
          justifyContent: "space-between",
        }}
      >
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: "none" } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div">
          Ma-Rifah
        </Typography>
        <Box
          width={{
            sm: "230px",
            md: "350px",
          }}
          display={{ xs: "none", sm: "block" }}
          overflow="hidden"
        >
          <SearchBar handleClick={handleOpenSearchPopUp} />
        </Box>
        <Stack
          direction="row"
          spacing={{
            xs: 1,
            sm: 2,
            md: 4,
          }}
          className="links"
          alignItems="center"
        >
          <Box
            onClick={handleOpenSearchPopUp}
            sx={{
              cursor: "pointer",
              display: {
                xs: "block",
                sm: "none",
              },
            }}
          >
            <SearchIcon sx={{ margin: "0 !important" }} />
          </Box>
          <Box
            fontWeight="bold"
            onClick={navigateHome}
            sx={{ cursor: "pointer", "&:hover": { color: "primary.main" } }}
          >
            Home
          </Box>
          <Box
            fontWeight="bold"
            onClick={navigateHome}
            sx={{ cursor: "pointer", "&:hover": { color: "primary.main" } }}
          >
            FAQ
          </Box>
          <Box
            fontWeight="bold"
            onClick={() => navigate(-1)}
            sx={{ cursor: "pointer", "&:hover": { color: "primary.main" } }}
          >
            Classes
          </Box>
        </Stack>
        {Cookies.get("id") === undefined ? (
          <Box
            fontWeight="bold"
            onClick={navigateLoginPage}
            color="primary.main"
            sx={{ cursor: "pointer" }}
          >
            Get Started!
          </Box>
        ) : (
          <Box
            fontWeight="bold"
            onClick={handleLogout}
            color="primary.main"
            sx={{ cursor: "pointer" }}
          >
            Log out!
          </Box>
        )}
      </Toolbar>
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

            <Stack className="questions-wrapper" mt={2} spacing={2}>
              {isLoading ? (
                <LoadingIndicator />
              ) : noContentFound ? (
                <NoContentFound iconFontSize={200} textFontSize={30} />
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
          </Box>
        )}
      </Box>
      {isAskQuestionOpen && (
        <AddQuestionComponent
          chapterId={activeChapter?.chapterId}
          operation="add question"
          addQuestion={addQuestion}
          onClose={() => setisAskQuestionOpen(false)}
          setisSnackbarOpen={setisSnackbarOpen}
          setsnackbarContent={setsnackbarContent}
        ></AddQuestionComponent>
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
        <Dialog
          aria-labelledby="dialog-title"
          aria-describedby="dialog-description"
          open={isMustLoginPopupOpen}
          onClose={closeMustLoginPopup}
        >
          <DialogTitle
            id="dialog-title"
            fontSize="30px"
            textAlign="center"
            color="primary.main"
            mb={2}
          >
            Notice!
          </DialogTitle>
          <DialogContent>
            <DialogContentText
              id="dialog-description"
              color="secondary.main"
              fontWeight="bold"
              fontSize="20px"
              mb={2}
            >
              You must login in order to add an answer!
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
              onClick={closeMustLoginPopup}
              sx={{ color: "white" }}
            >
              Later
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => navigate("/login?src=QA")}
              sx={{ color: "white" }}
            >
              Log in
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default QuestionsAndAnswers;

const SearchBar = (props: { handleClick: () => void }) => {
  const { handleClick } = props;
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}
      p={1}
      sx={{
        backgroundColor: "white",
        color: "black",
        borderRadius: "25px",
        cursor: "text",
        position: "relative",
        overflow: "visible",
      }}
      className="search-bar"
      onClick={handleClick}
    >
      <SearchIcon sx={{ margin: "0 !important" }} />
      <input
        type="text"
        placeholder="Search for a question"
        style={{ flex: "1" }}
      />
    </Stack>
  );
};

const Question = (props: questionType) => {
  const { userName, profileUrl } = useContext(ActiveContext);

  const [editQuestionOpen, seteditQuestionOpen] = useState<boolean>(false);

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
    questionFrom,
    questionId,
    questionContent,
    questionDate,
    imageURL,
    studentId,
    studentName,
    studentAvatar,
    questionAnswers,
    editQuestion,
    removeQuestion,
    addAnswer,
    updateAnswer,
    removeAnswer,
    setisSnackbarOpen,
    setsnackbarContent,
    openMustLoginPopup,
    handleChangeRating,
  } = props;

  // Add answer.
  const handleClick = async () => {
    if (Cookies.get("id") === undefined) {
      openMustLoginPopup();
    } else {
      if (textAreaRef.current.value === "") return;

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
        studentId: id,
        questionId,
      };

      axios
        .post("http://localhost/Ma-rifah/add_answer.php", inputs)
        .then(async (res) => {
          let stdName, stdAvatar;

          if (
            userName === undefined ||
            userName === "" ||
            profileUrl === undefined ||
            profileUrl === ""
          ) {
            const stdId = Cookies.get("id");
            const response = await axios.post(
              "http://localhost/Ma-rifah/get_main_student_info.php",
              stdId
            );
            console.log(response.data);
            if (response.data.status === "success") {
              stdName = response.data.message.studentName;
              stdAvatar = response.data.message.avatar;
            } else {
              return;
            }
          } else {
            stdName = userName;
            stdAvatar = profileUrl;
          }

          const newAnswer = {
            questionId,
            answerId: res.data.message,
            answerContent: textAreaRef.current.value,
            answerDate: formattedDatetime,
            answerSumRating: 0,
            numberOfRaters: 0,
            myRate: 0,
            studentId: Number(Cookies.get("id")),
            studentName: stdName,
            studentAvatar: stdAvatar,
          };

          const answers = Array.from(questionAnswers);
          answers.push(newAnswer);

          addAnswer({
            questionId,
            questionAnswers: answers,
            whereToAddAnswer: questionFrom,
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

  const handleEditQuestion = () => {
    seteditQuestionOpen(true);
    setanchorEl(null);
  };

  const deleteQuestion = async () => {
    setloading2(true);
    setupdateQuestionDisabled(true);
    const res = await axios.delete(
      "http://localhost/Ma-rifah/delete_question.php?id=" + questionId
    );

    if (res.data.status === "success") {
      removeQuestion({ questionId, whereToRemoveQuestion: questionFrom });
      setisSnackbarOpen(true);
      setsnackbarContent({ status: "success", message: res.data.message });
      setanchorEl(null);
      setloading2(false);

      if (imageURL) {
        // Make an API call to remove the previous image
        try {
          axios.post("http://localhost:/Ma-rifah/remove_image.php", {
            imageURL: imageURL,
          });
        } catch (error) {
          console.error("Error removing previous image", error);
        }
      }
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
    handleClose3();
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
      whereToUpdateRating: questionFrom,
    });
  };

  const onClose = () => {
    seteditQuestionOpen(false);
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
      {editQuestionOpen && (
        <AddQuestionComponent
          operation="edit question"
          editQuestion={editQuestion}
          questionFrom={questionFrom}
          onClose={onClose}
          questionId={questionId}
          questionContent={questionContent}
          imageURL={imageURL}
          setisSnackbarOpen={setisSnackbarOpen}
          setsnackbarContent={setsnackbarContent}
        />
      )}
      <Paper
        className="question"
        sx={{
          marginBottom: "15px",
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
          {imageURL !== null && imageURL !== "" && (
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
                src={imageURL}
                alt="question"
                width="100%"
                height="300px"
                style={{ objectFit: "contain" }}
              />
            </Box>
          )}

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
              {displayedAnswers.map((a) => {
                return (
                  <Answer
                    key={`answer_${a.answerId}`}
                    questionFrom={questionFrom}
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
                    updateAnswer={updateAnswer}
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
                    backgroundColor: "#0f1f3ebf",
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
              sx={{
                color: "black",
              }}
              loading={loading}
              disabled={updateQuestionDisabled}
              startIcon={<EditIcon />}
              onClick={handleEditQuestion}
            >
              Edit Question
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
    setvalue(myRate === null ? myRate : Number(myRate));
    setnbRaters(numberOfRaters);
    setsumRating(answerSumRating);
    if (answerSumRating === null) setavg(0);
    else setavg(Number((answerSumRating / numberOfRaters).toFixed(1)));
  }, [answerSumRating, myRate, numberOfRaters]);

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
        console.log(res.data);
        answerRef.current?.classList.add("hidden");
        setanchorEl(null);
        removeAnswer({
          questionId,
          answerId,
          whereToRemoveAnswer: questionFrom,
        });
        setloadingDeletingAnswer(false);
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
    <Stack
      ref={answerRef}
      sx={{
        "&.hidden": {
          display: "none",
        },
      }}
      spacing={1}
    >
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
              {calculateDate(answerDate)}
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

const SnackbarAlert = forwardRef<HTMLDivElement, AlertProps>(
  function SnackbarAlert(props, ref) {
    return <Alert elevation={6} ref={ref} {...props} />;
  }
);

const CustomTextInput = (props: {
  questionFrom: "search" | "normal";
  questionId: number;
  answerId: number;
  text: string;
  setloadingUpdatingAnswer: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: () => void;
  updateAnswer: (props: {
    questionId: number;
    answerId: number;
    answerContent: string;
    whereToUpdateAnswer: "search" | "normal";
  }) => void;
}) => {
  const {
    questionFrom,
    questionId,
    text,
    onClose,
    answerId,
    setloadingUpdatingAnswer,
    updateAnswer,
  } = props;

  const [input, setinput] = useState<string>(text);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setinput(event.target.value);
  };

  const handleClick = () => {
    onClose();
    setloadingUpdatingAnswer(true);
    axios
      .post("http://localhost:/Ma-rifah/update_answer.php", {
        answerId,
        answerContent: input,
      })
      .then((res) => {
        console.log(res.data);
        updateAnswer({
          questionId,
          answerId,
          answerContent: input,
          whereToUpdateAnswer: questionFrom,
        });
        setloadingUpdatingAnswer(false);
      })
      .catch((error) => console.log(error));
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}
      sx={{
        width: "100%",
        flex: "1",
        "& textarea:focus": {
          outline: "none",
        },
      }}
    >
      <textarea
        placeholder="Add an answer..."
        className="add-answer-input"
        rows={4}
        value={input}
        style={{
          border: "1px solid #ccc",
          borderRadius: "6px",
          padding: "10px 20px",
          fontWeight: "600",
          color: "var(--dark-blue)",
          resize: "none",
          flex: "1",
        }}
        onChange={handleChange}
      />
      <IconButton
        sx={{
          color: "primary.main",
          fontWeight: "bold",
          transition: ".6s",
          width: "45px",
          height: "45px",
          backgroundColor: "#0f1f3ebf",
          "&:hover": {
            bgcolor: "secondary.main",
          },
        }}
        onClick={handleClick}
      >
        <SendIcon sx={{ fontSize: "25px", fontWeight: "bold" }} />
      </IconButton>
    </Stack>
  );
};

const AddQuestionComponent = (props: {
  chapterId?: number;
  operation: "add question" | "edit question";
  addQuestion?: (props: question) => void;
  editQuestion?: (props: {
    questionId: number;
    questionContent: string;
    imageURL: string;
    whereToEditQuestion: "search" | "normal";
  }) => void;
  questionFrom: "search" | "normal";
  questionId?: number;
  questionContent?: string;
  imageURL?: string | null;
  onClose: () => void;
  setisSnackbarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setsnackbarContent: React.Dispatch<React.SetStateAction<serverResponseType>>;
}) => {
  const {
    chapterId,
    operation,
    addQuestion,
    editQuestion,
    questionFrom,
    questionId,
    questionContent,
    imageURL,
    onClose,
    setisSnackbarOpen,
    setsnackbarContent,
  } = props;

  const [droppedImage, setdroppedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [loadingPostingQuestion, setloadingPostingQuestion] =
    useState<boolean>(false);

  const [loadingUpdatingQuestion, setloadingUpdatingQuestion] =
    useState<boolean>(false);

  const [value, setvalue] = useState<string>("");

  const textFieldRef = useRef<HTMLTextAreaElement>(null!);
  const inputRef = useRef<HTMLInputElement>(null!);

  const { userName, profileUrl } = useContext(ActiveContext);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target?.files;

    if (imageURL) {
      // Make an API call to remove the previous image
      try {
        axios.post("http://localhost:/Ma-rifah/remove_image.php", {
          imageURL: imageURL,
        });
      } catch (error) {
        console.error("Error removing previous image", error);
      }
    }

    if (files && files.length > 0) {
      const file = files[0];

      const reader = new FileReader();
      reader.onload = () => {
        setdroppedImage(reader.result as string);
      };
      reader.readAsDataURL(file);

      setSelectedFile(file);
    }
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setvalue(e.currentTarget.value);
  };

  const handleClick = () => {
    inputRef.current.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();

    const files = e.dataTransfer.files;

    if (files.length > 0) {
      const file = files[0];

      // Display the dropped image
      const reader = new FileReader();
      reader.onload = () => {
        setdroppedImage(reader.result as string);
      };
      reader.readAsDataURL(file);

      setSelectedFile(file);
    }
  };

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("fileInput", file);

    try {
      const response = await axios.post(
        "http://localhost:/Ma-rifah/upload_image.php",
        formData
      );

      return response;
    } catch (error) {
      console.error("Error during file upload:", error);
      setisSnackbarOpen(true);
      setsnackbarContent({
        status: "error",
        message: "Error during file upload:",
      });
    }
  };

  const handlePostQuestion = async () => {
    setloadingPostingQuestion(true);

    const inputs = {
      chapterId,
      questionContent: textFieldRef.current.value,
      imageURL: null,
      studentId: Number(Cookies.get("id")),
    };

    if (selectedFile) {
      const response = await uploadFile(selectedFile);
      if (response?.data.status === "success") {
        const imageURL = response?.data.filePath;
        inputs.imageURL = imageURL;
      } else {
        console.error("Failed to upload file.");
        setisSnackbarOpen(true);
        setsnackbarContent({
          status: "error",
          message: "Error during file upload",
        });
        setloadingPostingQuestion(false);
        return;
      }
    }

    try {
      const res = await axios.post(
        "http://localhost:/Ma-rifah/add_question.php",
        inputs
      );

      if (res.data.status === "success") {
        const currentDate = new Date();

        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, "0");
        const day = String(currentDate.getDate()).padStart(2, "0");

        const hours = String(currentDate.getHours()).padStart(2, "0");
        const minutes = String(currentDate.getMinutes()).padStart(2, "0");
        const seconds = String(currentDate.getSeconds()).padStart(2, "0");

        const formattedDatetime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

        let stdName, stdAvatar;

        if (
          userName === undefined ||
          userName === "" ||
          profileUrl === undefined ||
          profileUrl === ""
        ) {
          const stdId = Cookies.get("id");
          const response = await axios.post(
            "http://localhost/Ma-rifah/get_main_student_info.php",
            stdId
          );
          console.log(response.data);
          if (response.data.status === "success") {
            stdName = response.data.message.studentName;
            stdAvatar = response.data.message.avatar;
          } else {
            return;
          }
        } else {
          stdName = userName;
          stdAvatar = profileUrl;
        }

        const newQuestion = {
          questionId: res.data.questionId,
          questionContent: textFieldRef.current.value,
          questionDate: formattedDatetime,
          imageURL: inputs.imageURL,
          studentId: Number(Cookies.get("id")),
          studentName: stdName,
          studentAvatar: stdAvatar,
          questionAnswers: [],
        };

        if (addQuestion !== undefined) addQuestion(newQuestion);

        setdroppedImage(null);
        setSelectedFile(null);
        textFieldRef.current.value = "";
        setloadingPostingQuestion(false);
        onClose();

        setisSnackbarOpen(true);
        setsnackbarContent({
          status: "success",
          message: "Question has been added successfully!",
        });
      } else {
        setisSnackbarOpen(true);
        setsnackbarContent({
          status: "error",
          message: "Error during adding question!",
        });
        setloadingPostingQuestion(false);
      }
    } catch (error) {
      setisSnackbarOpen(true);
      setsnackbarContent({
        status: "error",
        message: "Error during adding question!",
      });
      setloadingPostingQuestion(false);
    }
  };

  const handleResetImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setdroppedImage(null);
  };

  const handleEditQuestion = async () => {
    if (editQuestion !== undefined && questionId !== undefined) {
      if (selectedFile) {
        const formData = new FormData();
        formData.append("fileInput", selectedFile);

        setloadingUpdatingQuestion(true);

        try {
          const response = await axios.post(
            "http://localhost:/Ma-rifah/upload_image.php",
            formData
          );

          if (response.data.status === "success") {
            const imageURL = response.data.filePath;

            const inputs = {
              questionId,
              questionContent: value,
              imageURL,
            };

            try {
              const res = await axios.post(
                "http://localhost:/Ma-rifah/update_question.php",
                inputs
              );

              if (res.data.status === "success") {
                editQuestion({
                  questionId,
                  questionContent: value,
                  imageURL,
                  whereToEditQuestion: questionFrom,
                });

                setsnackbarContent({
                  status: "success",
                  message: "Question has been edited successfully!",
                });
                setisSnackbarOpen(true);

                setdroppedImage(null);
                setSelectedFile(null);
                textFieldRef.current.value = "";

                setloadingUpdatingQuestion(false);

                onClose();
              } else {
                setisSnackbarOpen(true);
                setsnackbarContent({
                  status: "error",
                  message: "Error during editing question!",
                });
                setloadingUpdatingQuestion(false);
              }
            } catch (error) {
              console.log("Error during editing question!");
              setisSnackbarOpen(true);
              setsnackbarContent({
                status: "error",
                message: "Error during editing question!",
              });
              setloadingUpdatingQuestion(false);
            }
          } else {
            console.error("Failed to upload file.");
            setisSnackbarOpen(true);
            setsnackbarContent({
              status: "error",
              message: "Error during file upload",
            });
            setloadingUpdatingQuestion(false);
          }
        } catch (error) {
          setisSnackbarOpen(true);
          setsnackbarContent({
            status: "error",
            message: "Error during file upload:",
          });
          setloadingUpdatingQuestion(false);
        }
      } else {
        const inputs = {
          questionId,
          questionContent: value,

          imageURL: imageURL || null,
        };

        setloadingUpdatingQuestion(true);

        try {
          const res = await axios.post(
            "http://localhost:/Ma-rifah/update_question.php",
            inputs
          );

          if (res.data.status === "success") {
            editQuestion({
              questionId,
              questionContent: value,
              imageURL: inputs.imageURL,
              whereToEditQuestion: questionFrom,
            });

            setsnackbarContent({
              status: "success",
              message: "Question has been edited successfully!",
            });
            setisSnackbarOpen(true);

            setdroppedImage(null);
            setSelectedFile(null);
            textFieldRef.current.value = "";

            setloadingUpdatingQuestion(false);

            onClose();
          } else {
            setisSnackbarOpen(true);
            setsnackbarContent({
              status: "error",
              message: "Error during editing question!",
            });
            setloadingUpdatingQuestion(false);
          }
        } catch (error) {
          console.log("Error during editing question!");
          setisSnackbarOpen(true);
          setsnackbarContent({
            status: "error",
            message: "Error during editing question!",
          });
          setloadingUpdatingQuestion(false);
        }
      }
    }
  };

  useEffect(() => {
    if (imageURL !== undefined) {
      setdroppedImage(imageURL);
    }
    if (questionContent !== undefined) setvalue(questionContent);
  }, [imageURL, questionContent]);

  return (
    <Box
      sx={{
        position: "fixed",
        zIndex: "1300",
        right: "0",
        bottom: "0",
        top: "0",
        left: "0",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          position: "fixed",
          right: "0",
          bottom: "0",
          top: "0",
          left: "0",
          opacity: "0.6",
          backgroundColor: "black",
          zIndex: "-1",
        }}
      />
      <Stack
        sx={{
          backgroundColor: "#fff",
          color: "rgba(0, 0, 0, 0.87)",
          borderRadius: "5px",
          margin: "32px",
          padding: "20px",
          position: "relative",
          boxShadow:
            "0px 11px 15px -7px rgba(0,0,0,0.2), 0px 24px 38px 3px rgba(0,0,0,0.14), 0px 9px 46px 8px rgba(0,0,0,0.12)",
          width: {
            xs: "400px",
            sm: "500px",
            md: "700px",
            lg: "900px",
          },
        }}
      >
        <Stack
          direction={{
            xs: "column",
            md: "row",
          }}
          spacing={{
            xs: 2,
            md: 4,
          }}
          sx={{
            "& textarea:focus": {
              outline: "none",
            },
          }}
          mb={3}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            minWidth="180px"
            textAlign={{
              xs: "center",
              md: "start",
            }}
          >
            Question Content:
          </Typography>
          <textarea
            value={value}
            onChange={handleTextAreaChange}
            placeholder="Add Your Question Here..."
            className="add-question-input"
            ref={textFieldRef}
            rows={8}
            style={{
              border: "1px solid #ccc",
              borderRadius: "6px",
              padding: "10px 20px",
              fontWeight: "600",
              color: "var(--dark-blue)",
              resize: "none",
              flex: "1",
            }}
          />
        </Stack>

        <Stack
          direction={{
            xs: "column",
            md: "row",
          }}
          spacing={{
            xs: 2,
            md: 4,
          }}
          mb={5}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            minWidth="180px"
            textAlign={{
              xs: "center",
              md: "start",
            }}
          >
            Question Image:
          </Typography>
          <Stack
            justifyContent="center"
            alignItems="center"
            flex="1"
            sx={{
              border: "1px solid #ccc",
              borderRadius: "6px",
              cursor: "pointer",
              overflow: "hidden",
            }}
            height="300px"
            onClick={handleClick}
          >
            <Stack
              spacing={2}
              alignItems="center"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              sx={{
                position: "relative",
                overflow: "hidden",
                objectFit: "contain",
              }}
            >
              {droppedImage ? (
                <>
                  <img
                    src={droppedImage === null ? "" : droppedImage}
                    alt="dropped"
                    style={{ width: "100%" }}
                  />
                  <CancelIcon
                    onClick={handleResetImage}
                    sx={{
                      color: "white",
                      position: "absolute",
                      zIndex: "10",
                      top: "0",
                      right: "10px",
                    }}
                  />
                </>
              ) : (
                <>
                  <CloudUploadIcon
                    color="secondary"
                    sx={{ fontSize: "40px" }}
                  />
                  <Typography variant="subtitle1" color="grey">
                    Drag Your Image Here Or Click To Upload!
                  </Typography>
                </>
              )}

              <input
                ref={inputRef}
                type="file"
                style={{ visibility: "hidden", position: "absolute" }}
                onChange={handleFileInputChange}
              ></input>
            </Stack>
          </Stack>
        </Stack>
        <Stack
          direction="row"
          spacing={{
            xs: 3,
            md: 17,
          }}
          justifyContent="center"
        >
          <Button
            startIcon={<CancelIcon />}
            disabled={loadingPostingQuestion}
            color="secondary"
            variant="contained"
            onClick={onClose}
            sx={{ color: "white" }}
          >
            Cancel
          </Button>
          {operation === "add question" ? (
            <LoadingButton
              loading={loadingPostingQuestion}
              startIcon={<PublishIcon />}
              onClick={handlePostQuestion}
              color="secondary"
              variant="contained"
              sx={{ color: "white" }}
            >
              Post Question
            </LoadingButton>
          ) : (
            <LoadingButton
              loading={loadingUpdatingQuestion}
              startIcon={<PublishIcon />}
              onClick={handleEditQuestion}
              color="secondary"
              variant="contained"
              sx={{ color: "white" }}
            >
              Update Question
            </LoadingButton>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};
