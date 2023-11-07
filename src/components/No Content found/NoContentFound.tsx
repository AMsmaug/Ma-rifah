import { Stack, Box } from "@mui/material";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";

const NoContentFound = () => {
  return (
    <Stack direction="row" justifyContent="center" alignItems="center">
      <Box textAlign="center">
        <SentimentVeryDissatisfiedIcon sx={{ fontSize: "200px" }} />
        <Box fontSize="30px">
          Sorry <br /> No content found!
        </Box>
      </Box>
    </Stack>
  );
};

export default NoContentFound;
