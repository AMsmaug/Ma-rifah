import { useRef } from "react";
import "./questionsAnswers.css";
import { Box, Stack, Typography, Button } from "@mui/material";

const QuestionsAnswers = () => {
  const readMoreButton = useRef<HTMLButtonElement>(null!);
  const readLessParagraph = () => {
    return `An interactive knowledge exchange where students come together to ask, share, and learn. Explore a wealth of 
    student-generated questions and insightful answers covering a wide range of subjects and topics. It's a space for curiosity
    , shared expertise, and the collective pursuit of understanding. Join the conversation, find answers, and contribute to
     a thriving community of learners.`;
  };

  const readMoreParagraph = () => {
    return `An interactive knowledge exchange where students come together to ask, share, and learn. Explore a wealth of 
    student-generated questions and insightful answers covering a wide range of subjects and topics. It's a space for curiosity
    , shared expertise, and the collective pursuit of understanding. Join the conversation, find answers, and contribute to
     a thriving community of learners. “Dive deeper into our vibrant Q&A community, where students from diverse backgrounds and experiences connect to
     enhance their learning journey. Our platform is a hub of curiosity, where questions are welcomed, knowledge is freely
      shared, and understanding flourishes. You’ll discover a vast repository of inquiries and responses spanning a wide 
      spectrum of subjects, creating a mosaic of insights. Join our discussion and become a contributor to our ever-growing
       community of learners. Together, we make learning an engaging and collaborative experience, and there’s always more to
        explore.”
            `;
  };

  const toggleReadMore = () => {
    const textBox = document.querySelector<HTMLParagraphElement>(
      ".questions-and-answers .text-box"
    );
    if (textBox?.classList.contains("expanded")) {
      if (textBox !== null) textBox.innerHTML = "";
      textBox?.append(readLessParagraph());
      textBox?.classList.remove("expanded");
      readMoreButton.current.innerHTML = "Read More";
    } else {
      if (textBox !== null) textBox.innerHTML = "";
      textBox?.append(readMoreParagraph());
      textBox?.classList.add("expanded");
      readMoreButton.current.innerHTML = "Read Less";
    }
  };

  return (
    <Box className="questions-and-answers" pt={4} pb={4} bgcolor="gray.main">
      <Box className="container">
        <h2 className="main-title">Questions & Answers</h2>
        <Stack
          direction={{ md: "row" }}
          justifyContent="center"
          gap={10}
          mt={10}
          pb={7}
        >
          <Box maxWidth={{ md: "600px" }}>
            <Typography
              variant="body1"
              mb={3}
              lineHeight={2}
              fontSize="18px"
              className="text-box"
              maxHeight="300px"
              p={1}
              sx={{
                transition: "1s ease-in-out",
                overflow: "hidden",
              }}
            >
              {readLessParagraph()}
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
              onClick={toggleReadMore}
              ref={readMoreButton}
            >
              View More
            </Button>
          </Box>
          <Box
            height="300px"
            flexBasis="300px"
            sx={{
              backgroundColor: "#ccc",
              overflow: "hidden",
            }}
            mt={3}
          >
            <img src="../../../../public/images/questionAnswerImg.jpg" alt="" />
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default QuestionsAnswers;
