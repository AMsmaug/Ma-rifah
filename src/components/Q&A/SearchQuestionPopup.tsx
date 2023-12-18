import { Typography, Box, Stack, Button } from "@mui/material/";

import LoadingIndicator from "../Loading Indicator/LoadingIndicator";
import NoContentFound from "../No Content found/NoContentFound";

import SearchIcon from "@mui/icons-material/Search";
import CancelIcon from "@mui/icons-material/Cancel";

import { useRef, useState } from "react";

import axios from "axios";
import Cookies from "js-cookie";

import {
  question,
  searchedQuestion,
  searchedQuestions,
} from "../../pages/QuestionsAndAnswers";

export type SearchedQuestionResultItemType = {
  question: question;
  courseName: string;
  chapterName: string;
  handleSelectSearchQuestion: (question: searchedQuestion) => void;
};

export type SearchQuestionPopupPropsType = {
  class_id: number | null;
  searchedQuestionsResult: searchedQuestions;
  setsearchedQuestionsResult: React.Dispatch<
    React.SetStateAction<searchedQuestions>
  >;
  handleCloseSearchPopUp: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleSelectSearchQuestion: (question: searchedQuestion) => void;
};

export const SearchQuestionPopup = (props: SearchQuestionPopupPropsType) => {
  const [isSearchQuestionsLoading, setisSearchQuestionsLoading] =
    useState<boolean>(false);

  const [searchNoContentFound, setsearchNoContentFound] =
    useState<boolean>(false);

  const searchPopUpRef = useRef<HTMLDivElement>(null!);
  const searchInputRef = useRef<HTMLInputElement>(null!);

  const {
    class_id,
    searchedQuestionsResult,
    setsearchedQuestionsResult,
    handleCloseSearchPopUp,
    handleSelectSearchQuestion,
  } = props;

  const handleSearch = async () => {
    const enteredString = searchInputRef.current.value;

    setisSearchQuestionsLoading(true);

    const stdId = Cookies.get("id");

    let inputs;

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

    if (res.data.length === 0) {
      setsearchedQuestionsResult([]);
      setsearchNoContentFound(true);
    } else {
      setsearchedQuestionsResult(res.data);
      setsearchNoContentFound(false);
    }
  };

  return (
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
                    {s.studentAvatar !== null && (
                      <img src={s.studentAvatar} width="20px" />
                    )}
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
            <Stack justifyContent="center" alignItems="center" height="100%">
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
  );
};

export const SearchedQuestionResultItem = (
  props: SearchedQuestionResultItemType
) => {
  const { question, courseName, chapterName, handleSelectSearchQuestion } =
    props;

  const {
    questionContent,
    questionAnswers,
    studentName,
    studentAvatar,
    questionDate,
  } = question;

  const handleClick = () => {
    const inputs = {
      ...question,
      courseName,
      chapterName,
    };
    handleSelectSearchQuestion(inputs);
  };

  return (
    <Box
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
      onClick={handleClick}
    >
      <Typography variant="subtitle1" fontWeight="500">
        {questionContent}
      </Typography>
      <Stack direction="row" justifyContent="space-between" px={1} mt={2}>
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
            {courseName}
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
            {chapterName}
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
            Answers: {questionAnswers.length}
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center">
          {studentAvatar !== null && <img src={studentAvatar} width="20px" />}
          <Typography variant="subtitle2" sx={{ color: "grey" }} pl={1}>
            {studentName}
          </Typography>
          <Typography variant="subtitle2" sx={{ color: "grey" }} pl={2}>
            {questionDate}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
};
