import { useRef, useState, useEffect } from "react";
import "./aboutus.css";
import { Stack, Box, Typography, Button } from "@mui/material";

const AboutUs = () => {
  const [isReadMore, setisReadMore] = useState<boolean>(false);

  const readMoreParagraph = () => {
    return (
      <>
        At Ma'rifah, we offer a comprehensive range of study materials and
        courses specifically curated to align with the Lebanese curriculum.
        Whether it's clarifying complex math problems, explaining intricate
        scientific concepts, or demystifying historical events, our platform is
        here to bridge the gap between what's taught in class and what students
        need to succeed. <br />
        Our team of dedicated educators is committed to making learning
        accessible and engaging, ensuring that no student feels left behind.
        With Ma'rifah, Lebanese students can unlock a world of understanding,
        conquer their classroom challenges, and embrace a more confident and
        successful approach to their studies. Welcome to Ma'rifah, where
        learning becomes your ally in the classroom.
      </>
    );
  };

  const wrapper = useRef<HTMLDivElement>(null);
  const [isShown, setIsShown] = useState(false);
  const animateContent = () => {
    if (window.scrollY >= 300) {
      setIsShown(true);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", animateContent);
    return () => {
      window.removeEventListener("scroll", animateContent);
    };
  }, []);

  return (
    <Box
      ref={wrapper}
      className={`about-us section`}
      id="About"
      pt={4}
      pb={4}
      bgcolor="gray.main"
    >
      <Box className="container">
        <h2 className="main-title">About us</h2>
        <Stack
          direction={{ lg: "row" }}
          justifyContent="center"
          className="about-us-content"
          columnGap={6}
          rowGap={4}
          mt={10}
          pb={7}
        >
          <Box textAlign="center" className="image-wrapper">
            <img
              className={`to-animate ${isShown ? `is-shown` : ``}`}
              width="500px"
              height="300px"
              src="../../../../public/images/teaching.jpg"
              alt=""
            />
          </Box>

          <Box
            className={`to-animate ${isShown ? `is-shown` : ``}`}
            width={{
              xs: "350px",
              sm: "580px",
              md: "740px",
              lg: "530px",
            }}
            sx={{
              textAlign: {
                xs: "center",
                lg: "start",
              },
            }}
            alignSelf="center"
          >
            <Typography
              sx={{
                lineHeight: "2",
                fontSize: "18px",
                transition: "0.6s ease-in-out",
                overflow: "hidden",
              }}
              maxHeight={
                isReadMore
                  ? "500px"
                  : {
                      xs: "350px",
                      sm: "220px",
                      md: "180px",
                      lg: "215px",
                    }
              }
              variant="body1"
              mb={4}
              className="text-box"
            >
              {readMoreParagraph()}
            </Typography>
            <Button
              className="readmore-button"
              variant="contained"
              onClick={() => setisReadMore(!isReadMore)}
              color="primary"
              sx={{ color: "white", "&:hover": { bgcolor: "primary.dark" } }}
            >
              Read more
            </Button>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default AboutUs;
