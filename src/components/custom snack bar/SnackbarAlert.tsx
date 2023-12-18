import { forwardRef } from "react";
import { Alert, AlertProps } from "@mui/material";

export const SnackbarAlert = forwardRef<HTMLDivElement, AlertProps>(
  function SnackbarAlert(props, ref) {
    return <Alert elevation={6} ref={ref} {...props} />;
  }
);
