import { RadioGroup, Grid, FormControlLabel, Radio } from "@mui/material";
import {
  possibilitiesComponentType,
  problemPossibilityType,
} from "./FinalExam";

export const Possibilities = (props: possibilitiesComponentType) => {
  const { problemId, problemPossibilities, handleChoosePoosibility } = props;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputs = {
      problemId,
      possibilityId: Number(e.target.value),
    };
    handleChoosePoosibility(inputs);
  };

  const check = () => {
    let nbRows = 6;

    problemPossibilities.forEach((p) => {
      if (p.possibilityContent.length > 20) nbRows = 12;
    });

    return nbRows;
  };

  return (
    <RadioGroup onChange={handleChange} name={`problem-${problemId}`}>
      <Grid container spacing={1}>
        {problemPossibilities.map((p) => (
          <Grid
            key={`possibility-id-${p.possibilityId}`}
            item
            xs={12}
            sm={check()}
          >
            <Possibility
              possibilityId={p.possibilityId}
              possibilityContent={p.possibilityContent}
            />
          </Grid>
        ))}
      </Grid>
    </RadioGroup>
  );
};

const Possibility = (props: problemPossibilityType) => {
  const { possibilityId, possibilityContent } = props;

  return (
    <FormControlLabel
      sx={{
        border: "2px solid #ccc",
        borderRadius: "4px",
        width: "100%",
      }}
      control={<Radio />}
      label={possibilityContent}
      value={possibilityId}
    />
  );
};
