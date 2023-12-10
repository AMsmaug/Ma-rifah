import { Stack, Box } from "@mui/material";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";

const NoContentFound = (props: {
  iconFontSize: number;
  textFontSize: number;
}) => {
  const { iconFontSize, textFontSize } = props;

  return (
    <Stack direction="row" justifyContent="center" alignItems="center">
      <Box textAlign="center">
        <SentimentVeryDissatisfiedIcon sx={{ fontSize: iconFontSize }} />
        <Box fontSize={textFontSize}>
          Sorry <br /> No content found!
        </Box>
      </Box>
    </Stack>
  );
};

export default NoContentFound;
