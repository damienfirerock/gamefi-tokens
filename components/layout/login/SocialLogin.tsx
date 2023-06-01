import React from "react";
import { Box, Divider, IconButton, Typography } from "@mui/material";
import { signIn } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";

import StyledCircularProgress from "../../common/StyledCircularProgress";

import { AppDispatch, RootState } from "../../../store";
import { setLoading } from "../../../features/AuthSlice";
import { WHITE, ALTERNATE_TEXT_COLOR } from "../../../src/theme";

enum BACKEND_LOGIN_TYPE {
  Google = "LT_Google",
  Facebook = "LT_Facebook",
  Apple = "LT_Apple",
}

export const SOCIAL_LOGIN_TYPES: Record<string, string> = {
  google: BACKEND_LOGIN_TYPE.Google,
  facebook: BACKEND_LOGIN_TYPE.Facebook,
  apple: BACKEND_LOGIN_TYPE.Apple,
};

export const SOCIAL_LOGIN_PROVIDERS = ["google", "facebook", "apple"];

const LOGIN_BUTTON_COLOUR = "#E6E6EE";

export interface LoginDialogProps {
  onClose: () => void;
}

const SocialLogin: React.FunctionComponent = () => {
  const dispatch = useDispatch<AppDispatch>();

  const authSlice = useSelector((state: RootState) => state.auth);
  const { loading } = authSlice;

  const handleSignIn = (provider: string) => {
    dispatch(setLoading(true));
    signIn(provider);
    // NOTE: There is a useEffect in Layout which detects NextAuth Session Changes,
    // and will set Auth Loading to False
  };
  return (
    <>
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
        {SOCIAL_LOGIN_PROVIDERS.map((provider) => (
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
                src={`/login-icons/${provider}-login-icon.svg`}
                alt={`${provider} logo`}
                layout="fill"
              />
              {loading && <StyledCircularProgress size={26} />}
            </Box>
          </IconButton>
        ))}
      </Box>
    </>
  );
};

export default SocialLogin;
