import React from "react";
import {
  Box,
  DialogTitle,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import StyledCircularProgress from "../../common/StyledCircularProgress";

import LoginDialogForm from "./LoginDialogForm";

import { AppDispatch, RootState } from "../../../store";
import { setDialogClosed, setLoading } from "../../../features/AuthSlice";
import { WHITE, PRIMARY_COLOR, ALTERNATE_TEXT_COLOR } from "../../../src/theme";

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
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle sx={{ color: "black", position: "relative" }}>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          size="small"
          sx={{
            position: "absolute",
            right: "1.2rem",
            top: "1.2rem",
            width: "0.2rem",
            height: "0.2rem",
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ padding: "1rem" }}>
        {/* Logo */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "0.75rem",
          }}
        >
          <Image
            src="/logo/火元素LOGO-with-words.svg"
            alt="Fire Element Logo"
            width={145}
            height={72}
          />
        </Box>

        {/* Possible Notification if redirect from Game Client */}
        {email && type && (
          <Typography
            variant="body2"
            sx={{
              marginBottom: "1rem",
              color: PRIMARY_COLOR,
              textAlign: "center",
            }}
          >
            Your game login was with email: {email} and type: {type}
          </Typography>
        )}

        <LoginDialogForm />

        {/* Social Login Divider */}
        <Box sx={{ position: "relative", marginBottom: "1.2rem" }}>
          <Divider light />
          <Typography
            variant="body2"
            sx={{
              color: ALTERNATE_TEXT_COLOR,
              background: WHITE,
              display: "inline",
              position: "absolute",
              marginTop: "-10px",
              marginLeft: "auto",
              marginRight: "auto",
              left: 0,
              right: 0,
              width: "5rem",
              textAlign: "center",
            }}
          >
            其它方式
          </Typography>
        </Box>

        {/* Social Login Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-evenly",
            marginBottom: "2rem",
          }}
        >
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
