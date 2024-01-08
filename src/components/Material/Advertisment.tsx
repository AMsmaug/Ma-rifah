import { Box, Skeleton } from "@mui/material";
import { useState, useEffect } from "react";

export const Advertisment = ({
  formQuestionAndAnswers,
}: {
  formQuestionAndAnswers: boolean;
}) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <Box
      width={formQuestionAndAnswers ? `600px` : `350px`}
      padding={`30px`}
      height={`calc(100vh - 64px)`}
      position={"sticky"}
      top={`64px`}
      bgcolor={formQuestionAndAnswers ? `white` : ``}
      display={
        formQuestionAndAnswers
          ? {
              xs: `none`,
              md: `none`,
              lg: `block`,
            }
          : {
              xs: `none`,
              md: `none`,
              lg: `block`,
            }
      }
      // flexShrink={2}
    >
      {isLoading ? (
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{
            width: `100%`,
            height: `200px`,
          }}
        />
      ) : (
        <Box
          width={`100%`}
          height={`200px`}
          bgcolor={`#ccc`}
          display={`flex`}
          justifyContent={`center`}
          alignItems={`center`}
          fontSize={`20px`}
          fontWeight={`bold`}
        >
          Ads
        </Box>
      )}
      {isLoading ? (
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{
            marginTop: `60px`,
            width: `100%`,
            height: `400px`,
          }}
        />
      ) : (
        <Box
          mt={`60px`}
          width={`100%`}
          height={`400px`}
          bgcolor={`#ccc`}
          display={`flex`}
          justifyContent={`center`}
          alignItems={`center`}
          fontSize={`20px`}
          fontWeight={`bold`}
        >
          Ads
        </Box>
      )}
    </Box>
  );
};
