import { Box } from "@mui/material";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";

export const PageNotFound = () => {
  return (
    <Box textAlign={`center`} mt={6} fontSize={30}>
      <Box color={`secondary.main`} mb={2}>
        Sorry, No Content Found!
      </Box>
      <SentimentVeryDissatisfiedIcon color="primary" sx={{ fontSize: 150 }} />
    </Box>
  );
};
