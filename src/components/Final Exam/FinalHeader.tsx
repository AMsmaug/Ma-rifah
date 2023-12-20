import { Box, Stack, Typography } from "@mui/material";

type finalHeaderType = {
  courseName: string | undefined;
  nbOfProblems: number;
  timeLeft: number;
};

export const FinalHeader = (props: finalHeaderType) => {
  const { courseName, nbOfProblems, timeLeft } = props;

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${String(hours).padStart(2, "0")} h:${String(minutes).padStart(
        2,
        "0"
      )}`;
    } else if (minutes > 0) {
      return `${String(minutes).padStart(2, "0")}:${String(
        remainingSeconds
      ).padStart(2, "0")}`;
    } else {
      return `${remainingSeconds}s`;
    }
  };

  return (
    <Box className="final-header">
      <Typography variant="h4" mb={2} textAlign="center" fontWeight="bold">
        {courseName} Final Exam
      </Typography>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        px={2}
      >
        <Typography>
          Total Number Of Questions:
          <Typography component="span" ml={1} fontWeight="bold">
            {nbOfProblems}
          </Typography>
        </Typography>
        <Typography textAlign="end">
          Time Left:
          <Typography component="span" ml={1} fontWeight="bold">
            {formatTime(timeLeft)}
          </Typography>
        </Typography>
      </Stack>
    </Box>
  );
};
