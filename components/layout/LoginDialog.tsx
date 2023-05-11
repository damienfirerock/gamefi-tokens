import React from "react";
import { DialogTitle, Dialog, Typography } from "@mui/material";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
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
  const { query } = useRouter();
  const { email, type } = query;

  const authSlice = useSelector((state: RootState) => state.auth);
  const { dialogOpen, loading } = authSlice;

  const handleClose = () => {
    dispatch(setDialogClosed());
  };

  return (
    <Dialog onClose={handleClose} open={dialogOpen}>
      <DialogTitle>Login</DialogTitle>
      {email && type && (
        <Typography variant="h6" sx={{ marginTop: 5, marginBottom: 2 }}>
          Your game login was with email: {email} and type: {type}
        </Typography>
      )}
      {providers.map((provider) => (
        <InteractButton
          key={provider}
          text={provider}
          variant="contained"
          method={() => signIn(provider)}
          loading={loading}
        />
      ))}
    </Dialog>
  );
};

export default LoginDialog;
