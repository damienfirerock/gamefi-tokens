import React, { useCallback, useState, useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { IconButton } from "@mui/material";
import ChevronLeftOutlinedIcon from "@mui/icons-material/ChevronLeftOutlined";
import { signIn } from "next-auth/react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import InteractButton from "../../common/InteractButton";
import PasswordField from "../../common/fields/PasswordField";
import DefaultField from "../../common/fields/DefaultField";
import SocialLogin from "./SocialLogin";

import { AppDispatch, RootState } from "../../../store";
import { NAV_TEXT_COLOUR } from "../../../src/theme";
import {
  requestVerificationCode,
  registerViaEmail,
  changePassword,
  setLoading,
} from "../../../features/AuthSlice";

// TODO: Update when localisation is done
enum FormType {
  Login = "Login",
  Register = "Register",
  ChangePassword = "Change Password",
}

interface FormFields {
  email: string;
  verifyCode: string;
  password: string;
  repeatPassword: string;
}

const LoginDialogForm: React.FunctionComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const authSlice = useSelector((state: RootState) => state.auth);
  const { loading } = authSlice;

  const [currentForm, setCurrentForm] = useState<FormType>(FormType.Login);
  const areAdditionalFieldsRequired = currentForm !== FormType.Login;

  const schema = useMemo(
    () =>
      yup.object().shape({
        email: yup.string().required(),
        verifyCode: areAdditionalFieldsRequired
          ? yup.string().required()
          : yup.string(),
        password: yup.string().required(),
        repeatPassword: yup
          .string()
          .test("match", "Passwords must match", function (value) {
            return areAdditionalFieldsRequired
              ? value === this.parent.password
              : true;
          })
          .when([], () =>
            areAdditionalFieldsRequired ? yup.string().required() : yup.string()
          ),
      }),
    [areAdditionalFieldsRequired]
  );

  const {
    control,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm<FormFields>({
    resolver: yupResolver(schema),
  });

  const emailValue = watch("email");

  const handleChangeOption = (option: FormType) => {
    setCurrentForm(option);
  };

  const handleRequestVerificationCode = useCallback(() => {
    dispatch(requestVerificationCode({ context: emailValue }));
  }, [dispatch, emailValue]);

  const onSubmit = (data: FormFields) => {
    const { email, verifyCode, password } = data;
    // Repeat password is only for comparison on client,
    // not sent to server

    if (currentForm === FormType.Login) {
      dispatch(setLoading(true));
      signIn("credentials", { email, password });
      // NOTE: There is a useEffect in Layout which detects NextAuth Session Changes and should update session in AuthSLice,
      // and will set Auth Loading to False

      // dispatch(loginViaEmail({ email, password }));
    } else if (currentForm === FormType.Register) {
      dispatch(registerViaEmail({ email, verifyCode, password }));
    } else if (currentForm === FormType.ChangePassword) {
      dispatch(changePassword({ email, verifyCode, password }));
    }
  };

  return (
    <>
      {currentForm !== FormType.Login && (
        <Box sx={{ position: "relative" }}>
          <IconButton
            onClick={() => handleChangeOption(FormType.Login)}
            sx={{ position: "absolute", right: 0, bottom: 0 }}
          >
            {/* Back */}
            <ChevronLeftOutlinedIcon color="primary" />
          </IconButton>
        </Box>
      )}

      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        {/* TextFields */}
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <DefaultField
            name="email"
            label="Email"
            control={control}
            error={errors.email?.message}
          />
          {currentForm !== FormType.Login && (
            <Box
              sx={{ display: "flex", alignItems: "flex-start", height: "100%" }}
            >
              <DefaultField
                name="verifyCode"
                label="Verification Code"
                control={control}
                error={errors.verifyCode?.message}
              />
              <InteractButton
                text="Verification Code"
                method={handleRequestVerificationCode}
                loading={loading}
                disabled={!emailValue}
                variant="contained"
                sx={{
                  borderRadius: 10,
                  width: "50%",
                  marginTop: "0.3rem",
                  marginLeft: "0.6rem",
                  height: "3rem",
                  fontSize: "0.75rem",
                }}
                // size="small"
              />
            </Box>
          )}
          <PasswordField
            name="password"
            label="password"
            control={control}
            error={errors.password?.message}
          />
          {currentForm !== FormType.Login && (
            <PasswordField
              name="repeatPassword"
              label="password (repeat)"
              control={control}
              error={errors.repeatPassword?.message}
            />
          )}
        </Box>

        {/* Options to Register or Change Password */}
        {currentForm === FormType.Login && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: "1rem",
            }}
          >
            <InteractButton
              text="注册新账户"
              method={() => handleChangeOption(FormType.Register)}
              loading={loading}
              variant="text"
              size="small"
              sx={{ color: NAV_TEXT_COLOUR }}
            />
            <InteractButton
              text="忘记密码？"
              method={() => handleChangeOption(FormType.ChangePassword)}
              loading={loading}
              variant="text"
              size="small"
              sx={{ color: NAV_TEXT_COLOUR }}
            />
          </Box>
        )}

        {currentForm === FormType.Register && (
          <Typography variant="caption" sx={{ color: NAV_TEXT_COLOUR }}>
            By signing up, you agree to the user policy.
          </Typography>
        )}

        {/* Submission Button */}
        <InteractButton
          text={currentForm}
          method={() => {
            return null;
          }}
          loading={loading}
          variant="contained"
          fullWidth
          sx={{ borderRadius: 5, marginBottom: "1.2rem" }}
          size="large"
          type="submit"
        />

        {currentForm === FormType.Login && <SocialLogin />}
      </Box>
    </>
  );
};

export default LoginDialogForm;
