import { Box } from "@mui/material";

export const Advertisment = () => {
  return (
    <Box
      width={`400px`}
      padding={`30px`}
      height={`calc(100vh - 64px)`}
      position={"sticky"}
      top={`64px`}
      display={{
        xs: `none`,
        md: `none`,
        lg: `block`,
      }}
      // flexShrink={2}
    >
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
    </Box>
  );
};
