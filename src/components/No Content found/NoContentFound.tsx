import { Stack, Box } from "@mui/material";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";

const NoContentFound = (props: {
  seperateString: boolean;
  textFontSize: number;
  iconFontSize: number;
  iconColor?: string;
}) => {
  const {
    seperateString,
    textFontSize,
    iconFontSize,
    iconColor = `black`,
  } = props;

  return (
    <Stack direction="row" justifyContent="center" alignItems="center">
      <Box textAlign="center">
        <SentimentVeryDissatisfiedIcon
          sx={{ fontSize: iconFontSize, color: iconColor }}
        />
        <Box fontSize={textFontSize}>
          Sorry, {seperateString ? <br /> : null} No content found!
        </Box>
      </Box>
    </Stack>
  );
};

export default NoContentFound;
