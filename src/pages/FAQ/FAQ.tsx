import {
  Stack,
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Skeleton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import "./faq.css";

import { useState, useEffect } from "react";

import axios from "axios";

import { SnackbarAlert } from "../../components/custom snack bar/SnackbarAlert";
import Snackbar from "@mui/material/Snackbar";

type faqType = {
  questionId: number;
  faqContent: string;
  faqAnswer: string;
};

const Faq = () => {
  const [loadingFetchingQuestions, setloadingFetchingQuestions] =
    useState<boolean>(false);

  const [questions, setquestions] = useState<faqType[]>([]);

  const [errorFetchingData, seterrorFetchingData] = useState<boolean>(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setloadingFetchingQuestions(true);
        const res = await axios.get("http://localhost/Ma-rifah/get_FAQ.php");
        if (res.data.status === "success") {
          setquestions(res.data.payload);
          setloadingFetchingQuestions(false);
        } else {
          seterrorFetchingData(true);
        }
      } catch (error) {
        seterrorFetchingData(true);
      }
    };

    fetchQuestions();
  }, []);

  return (
    <Box className="FAQ container" px={4} py={2}>
      {errorFetchingData && (
        <Snackbar
          open={errorFetchingData}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <SnackbarAlert
            severity="error"
            sx={{ padding: "12px 15px", fontSize: "17px" }}
          >
            Error fetching Data. Try again later.
          </SnackbarAlert>
        </Snackbar>
      )}
      <Box
        sx={{
          width: "100%",
          height: "15px",
          position: "fixed",
          backgroundColor: "var(--dark-blue)",
          top: "0",
          left: "0",
        }}
      ></Box>
      <Typography
        className="main-title"
        variant="h4"
        sx={{
          margin: "40px auto 10px",
          fontSize: {
            xs: "18px",
            sm: "30px",
            md: "34px",
          },
        }}
      >
        Frequently Asked Questions
      </Typography>
      <Stack mt={10} mb={3} spacing={4}>
        {loadingFetchingQuestions ? (
          <LoadingComponent />
        ) : (
          questions.map((q) => (
            <FaqQuesiton
              key={`faq-${q.questionId}`}
              questionId={q.questionId}
              faqContent={q.faqContent}
              faqAnswer={q.faqAnswer}
            />
          ))
        )}
      </Stack>
    </Box>
  );
};

const FaqQuesiton = (props: faqType) => {
  const { faqContent, faqAnswer } = props;

  const [isActive, setisActive] = useState<boolean>(false);

  const handleChange = (isExpanded: boolean) => {
    setisActive(isExpanded);
  };

  return (
    <Accordion
      sx={{
        backgroundColor: "transparent",
        boxShadow: "none",
        "&:before": {
          height: "0",
        },
      }}
      onChange={(_, isExpanded) => handleChange(isExpanded)}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography
          variant="h6"
          fontWeight={500}
          className="faq-question"
          sx={{
            color: isActive ? "#0366da" : "inherit",
          }}
        >
          {faqContent}
        </Typography>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          backgroundColor: "#fff",
          boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
          borderRadius: "5px",
          p: "20px",
          lineHeight: "1.8",
          marginTop: "10px",
        }}
      >
        {faqAnswer}
      </AccordionDetails>
    </Accordion>
  );
};

const LoadingComponent = () => {
  return (
    <Stack spacing={4}>
      <Skeleton
        variant="rectangular"
        animation="wave"
        height={56}
        sx={{ borderRadius: "6px" }}
      />
      <Skeleton
        variant="rectangular"
        animation="wave"
        height={56}
        sx={{ borderRadius: "6px" }}
      />
      <Skeleton
        variant="rectangular"
        animation="wave"
        height={56}
        sx={{ borderRadius: "6px" }}
      />
      <Skeleton
        variant="rectangular"
        animation="wave"
        height={56}
        sx={{ borderRadius: "6px" }}
      />
      <Skeleton
        variant="rectangular"
        animation="wave"
        height={56}
        sx={{ borderRadius: "6px" }}
      />
      <Skeleton
        variant="rectangular"
        animation="wave"
        height={56}
        sx={{ borderRadius: "6px" }}
      />
    </Stack>
  );
};

export default Faq;
