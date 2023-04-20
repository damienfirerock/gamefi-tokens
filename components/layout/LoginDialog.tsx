import React from "react";
import { DialogTitle, Dialog } from "@mui/material";
import { signIn } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";

import InteractButton from "../common/InteractButton";

import { AppDispatch, RootState } from "../../store";
import { setDialogClosed } from "../../features/AuthSlice";

const providers = ["google", "facebook", "apple"];

export interface LoginDialogProps {
  onClose: () => void;
}

const LoginDialog: React.FunctionComponent = () => {
  const dispatch = useDispatch<AppDispatch>();

  const authSlice = useSelector((state: RootState) => state.auth);
  const { dialogOpen, loading } = authSlice;

  const handleClose = () => {
    dispatch(setDialogClosed());
  };

  return (
    <Dialog onClose={handleClose} open={dialogOpen}>
      <DialogTitle>Login</DialogTitle>
      {providers.map((provider) => (
        <InteractButton
          key={provider}
          text={provider}
          method={() => signIn(provider)}
          loading={loading}
        />
      ))}
    </Dialog>
  );
};

export default LoginDialog;
