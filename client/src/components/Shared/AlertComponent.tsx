import { forwardRef } from "react";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

const AlertComponent = forwardRef<HTMLDivElement, AlertProps>(
  function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  },
);

export default AlertComponent;
