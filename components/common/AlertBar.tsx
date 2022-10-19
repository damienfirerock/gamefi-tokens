import React, { useEffect } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

interface IAlertBar extends AlertProps {
  text?: string | null;
  handleClearAlertSource?: () => void;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const AlertBar: React.FunctionComponent<IAlertBar> = ({
  text,
  handleClearAlertSource,
  severity,
}) => {
  const [alertText, setAlertText] = React.useState<string>("");

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    handleClearAlertSource && handleClearAlertSource();
    setAlertText("");
  };

  useEffect(() => {
    if (!!text) {
      setAlertText(text);
    }
  }, [text]);

  return (
    <Snackbar open={!!alertText} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
        {alertText}
      </Alert>
    </Snackbar>
  );
};

export default AlertBar;
