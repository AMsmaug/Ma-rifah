import { useRef } from "react";
import "./questionsAnswers.css";
import { Box, Stack, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const QuestionsAnswers = () => {
  const readMoreButton = useRef<HTMLButtonElement>(null!);
  const readMoreParagraphElement = useRef<HTMLButtonElement>(null!);

  const navigate = useNavigate();

  const readMoreParagraph = () => {
    return (
      <>
        An interactive knowledge exchange where students come together to ask,
        share, and learn. Explore a wealth of student-generated questions and
        insightful answers covering a wide range of subjects and topics. It's a
        space for curiosity , shared expertise, and the collective pursuit of
        understanding. Join the conversation, find answers, and contribute to a
        thriving community of learners.
        <br />
        “Dive deeper into our vibrant Q&A community, where students from diverse
        backgrounds and experiences connect to enhance their learning journey.
        Our platform is a hub of curiosity, where questions are welcomed,
        knowledge is freely shared, and understanding flourishes. You’ll
        discover a vast repository of inquiries and responses spanning a wide
        spectrum of subjects, creating a mosaic of insights. Join our discussion
        and become a contributor to our ever-growing community of learners.
        Together, we make learning an engaging and collaborative experience, and
        there’s always more to explore.”
      </>
    );
  };

  const toggleReadMore = () => {
    if (readMoreParagraphElement?.current?.classList.contains("expanded")) {
      readMoreParagraphElement?.current?.classList.remove("expanded");
      readMoreButton.current.innerHTML = "Read More";
    } else {
      readMoreParagraphElement?.current?.classList.add("expanded");
      readMoreButton.current.innerHTML = "Read Less";
    }
  };

  return (
    <Box
      className="questions-and-answers section"
      id="Q&A"
      pt={4}
      pb={4}
      bgcolor="gray.main"
    >
      <Box className="container">
        <h2 className="main-title">Questions & Answers</h2>
        <Stack
          direction={{ lg: "row" }}
          justifyContent="center"
          alignItems="center"
          columnGap={6}
          rowGap={4}
          mt={10}
          pb={7}
        >
          <Box
            width={{ xs: "350px", sm: "580px", md: "740px", lg: "600px" }}
            textAlign={{
              xs: "center",
              lg: "start",
            }}
          >
            <Typography
              ref={readMoreParagraphElement}
              variant="body1"
              mb={3}
              lineHeight={2}
              fontSize="18px"
              className="text-box"
              maxHeight={{
                xs: "400px",
                sm: "230px",
                md: "190px",
                lg: "220px",
              }}
              p={1}
              sx={{
                transition: "0.6s ease-in-out",
                overflow: "hidden",
              }}
            >
              {readMoreParagraph()}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{
                "&:hover": {
                  bgcolor: "primary.dark",
                },
                color: "white",
              }}
              onClick={() => navigate("/hey")}
              ref={readMoreButton}
              className="readmore-button"
            >
              View More
            </Button>
          </Box>
          <Box textAlign="center">
            <img
              width="350px"
              src="../../../../public/images/questionAnswerImg.jpg"
              alt=""
            />
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default QuestionsAnswers;
