import React from "react";
import {
  Box,
  DialogTitle,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
} from "@mui/material";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import StyledCircularProgress from "../common/StyledCircularProgress";

import InteractButton from "../common/InteractButton";

import { AppDispatch, RootState } from "../../store";
import { setDialogClosed, setLoading } from "../../features/AuthSlice";
import { WHITE } from "../../src/theme";

const providers = ["Google", "Facebook", "Apple"];

const LOGIN_BUTTON_COLOUR = "#E6E6EE";

export interface LoginDialogProps {
  onClose: () => void;
}

const LoginDialog: React.FunctionComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { query } = useRouter();
  const { email, type } = query;

  const authSlice = useSelector((state: RootState) => state.auth);
  const { dialogOpen, loading } = authSlice;

  const handleSignIn = (provider: string) => {
    dispatch(setLoading(true));
    signIn(provider);
    // NOTE: There is a useEffect in Layout which detects NextAuth Session Changes,
    // and will set Auth Loading to False
  };

  const handleClose = () => {
    dispatch(setDialogClosed());
  };

  return (
    <Dialog
      onClose={handleClose}
      open={dialogOpen}
      PaperProps={{ sx: { background: WHITE } }}
      maxWidth="md"
    >
      <DialogTitle sx={{ color: "black", position: "relative" }}>
        <Box sx={{ width: "9rem", height: "4.5rem" }}>
          <Image
            src="/logo/火元素LOGO-with-words.svg"
            alt="Fire Element Logo"
            layout="fill"
          />
        </Box>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          size="small"
          sx={{
            position: "absolute",
            right: 10,
            top: 10,
            width: "0.2rem",
            height: "0.2rem",
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {email && type && (
          <Typography variant="h6" sx={{ marginTop: 5, marginBottom: 2 }}>
            Your game login was with email: {email} and type: {type}
          </Typography>
        )}
        <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
          {providers.map((provider) => (
            <IconButton
              aria-label={`${provider} Login Button`}
              size="small"
              key={provider}
              onClick={() => handleSignIn(provider.toLowerCase())}
              disabled={loading}
              sx={{
                background: LOGIN_BUTTON_COLOUR,
                borderRadius: 1,
              }}
            >
              <Box
                sx={{ width: "1.1rem", height: "1.1rem", position: "relative" }}
              >
                <Image
                  src={`/login-icons/${provider}-Login-Icon.svg`}
                  alt={`${provider} Logo`}
                  layout="fill"
                />
                {loading && <StyledCircularProgress size={26} />}
              </Box>
            </IconButton>
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
