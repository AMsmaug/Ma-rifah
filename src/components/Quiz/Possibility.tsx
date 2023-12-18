import { FormControlLabel, ListItemButton, Radio } from "@mui/material";
import "./quiz.css";

export const Possibility = ({
  sentence,
  possId,
  isChecked,
  isDisabled,
  isCorrect,
}: {
  sentence: string;
  possId: number;
  isChecked: boolean;
  isDisabled: boolean;
  isCorrect?: boolean;
}) => {
  return (
    <ListItemButton
      sx={{
        padding: `0`,
        paddingLeft: `15px`,
        bgcolor:
          isCorrect && isDisabled
            ? `#4dab4d`
            : 0 || (isChecked && isDisabled)
            ? `#f84841`
            : 0,
        "&:not(:last-child)": {
          borderBottom: `1px solid #ccc`,
        },
      }}
      disabled={isDisabled}
      className="custom-disabled-radio"
    >
      <FormControlLabel
        control={
          <Radio
            size="small"
            color={isDisabled ? `secondary` : "primary"}
            checked={isChecked}
          />
        }
        value={possId}
        label={sentence}
        sx={{
          width: `100%`,
          height: `100%`,
          padding: `10px 0px 10px 20px`,
          color: !isDisabled
            ? isChecked
              ? `#fca311`
              : null
            : isChecked
            ? `#13213c`
            : null,
        }}
      />
    </ListItemButton>
  );
};
