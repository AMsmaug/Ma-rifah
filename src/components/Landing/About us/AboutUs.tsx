import { useRef } from "react";
import "./aboutus.css";
import { Stack, Box, Typography, Button } from "@mui/material";

const AboutUs = () => {
  const readMoreButton = useRef<HTMLButtonElement>(null!);

  const readLessParagraph = () => {
    return `At Ma'rifah, we offer a comprehensive range of study materials and courses specifically curated to align
     with the Lebanese curriculum. Whether it's clarifying complex math problems, explaining intricate scientific concepts,
      or demystifying historical events, our platform is here to bridge the gap between what's taught in class and what
       students need to succeed.`;
  };

  const readMoreParagraph = () => {
    return `At Ma'rifah, we offer a comprehensive range of study materials and courses specifically curated to align with the Lebanese curriculum. Whether it's clarifying complex math problems, explaining intricate scientific concepts, or demystifying historical events, our platform is here to bridge the gap between what's taught in class and what students need to succeed.

    Our team of dedicated educators is committed to making learning accessible and engaging, ensuring that no student feels
     left behind. With Ma'rifah, Lebanese students can unlock a world of understanding, conquer their classroom challenges,
      and embrace a more confident and successful approach to their studies. Welcome to Ma'rifah, where learning becomes your
       ally in the classroom.
        `;
  };

  const toggleReadMore = () => {
    const textBox = document.querySelector<HTMLParagraphElement>(".text-box");
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
    <Box className="container about-us">
      <h2 className="main-title">About us</h2>
      <Stack
        direction={{ md: "row", lg: "row", xl: "row" }}
        justifyContent="center"
        className="about-us-content"
        gap={10}
        mt={10}
        mb={10}
      >
        <Box
          height="300px"
          flexBasis="300px"
          sx={{
            backgroundColor: "#ccc",
            overflow: "hidden",
          }}
          mt={3}
        >
          <img src="../../../../public/images/adam.jpg" alt="" />
        </Box>
        <Box
          p={2}
          flexBasis={{
            md: "45%",
            lg: "45%",
            xl: "45%",
          }}
          sx={{
            textAlign: {
              xs: "center",
              md: "start",
            },
          }}
        >
          <Typography
            sx={{
              lineHeight: "2",
              fontSize: "18px",
              transition: "1s",
              maxHeight: {
                xs: "300px",
                sm: "200px",
                md: "350px",
                lg: "300px",
                xl: "300px",
              },

              overflow: "hidden",
            }}
            variant="body1"
            mb={4}
            component="div"
            className="text-box"
          >
            At Ma'rifah, we offer a comprehensive range of study materials and
            courses specifically curated to align with the Lebanese curriculum.
            Whether it's clarifying complex math problems, explaining intricate
            scientific concepts, or demystifying historical events, our platform
            is here to bridge the gap between what's taught in class and what
            students need to succeed.
          </Typography>
          <Button
            ref={readMoreButton}
            variant="contained"
            onClick={toggleReadMore}
          >
            Read more
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default AboutUs;
