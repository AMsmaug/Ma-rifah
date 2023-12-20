import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

type MustLoginPopupPropsType = {
  isMustLoginPopupOpen: boolean;
  setisMustLoginPopupOpen: React.Dispatch<boolean>;
};

export const MustLoginPopup = (props: MustLoginPopupPropsType) => {
  const { isMustLoginPopupOpen, setisMustLoginPopupOpen } = props;

  const navigate = useNavigate();

  const closeMustLoginPopup = () => {
    setisMustLoginPopupOpen(false);
  };

  return (
    <Dialog
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      open={isMustLoginPopupOpen}
      onClose={closeMustLoginPopup}
    >
      <DialogTitle
        id="dialog-title"
        fontSize="30px"
        textAlign="center"
        color="primary.main"
        mb={2}
      >
        Notice!
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          id="dialog-description"
          color="secondary.main"
          fontWeight="bold"
          fontSize="20px"
          mb={2}
        >
          You must login in order to add an answer!
        </DialogContentText>
      </DialogContent>
      <DialogActions
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: "50px",
          marginBottom: "20px",
        }}
      >
        <Button
          variant="contained"
          color="secondary"
          onClick={closeMustLoginPopup}
          sx={{ color: "white" }}
        >
          Later
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate("/login?src=QA")}
          sx={{ color: "white" }}
        >
          Log in
        </Button>
      </DialogActions>
    </Dialog>
  );
};
