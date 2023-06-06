import React, { useCallback, useEffect, useState, useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { IconButton } from "@mui/material";
import ChevronLeftOutlinedIcon from "@mui/icons-material/ChevronLeftOutlined";
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
  loginViaEmail,
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

const emailSchema = yup.string().email().required();

const LoginDialogForm: React.FunctionComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const authSlice = useSelector((state: RootState) => state.auth);
  const { loading } = authSlice;

  const [countdown, setCountdown] = useState(0);

  const [currentForm, setCurrentForm] = useState<FormType>(FormType.Login);
  const areAdditionalFieldsRequired = currentForm !== FormType.Login;

  const schema = useMemo(
    () =>
      yup.object().shape({
        email: yup.string().email().required(),
        verifyCode: areAdditionalFieldsRequired
          ? yup.string().length(6).required()
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

  const isEmailValid = useMemo(() => {
    try {
      emailSchema.validateSync(emailValue);
      return true;
    } catch (error) {
      return false;
    }
  }, [emailValue]);

  const handleChangeOption = (option: FormType) => {
    setCurrentForm(option);
  };

  const handleRequestVerificationCode = useCallback(async () => {
    const result = await dispatch(
      requestVerificationCode({ context: emailValue })
    );
    // Only set countdown if request succeeds
    if (requestVerificationCode.fulfilled.match(result)) {
      setCountdown(60);
    }
  }, [dispatch, emailValue]);

  const onSubmit = async (data: FormFields) => {
    const { email, verifyCode, password } = data;
    // Repeat password is only for comparison on client,
    // not sent to server

    if (currentForm === FormType.Login) {
      dispatch(loginViaEmail({ email, password }));
    } else if (currentForm === FormType.Register) {
      // For other forms, shift form back to login if
      // either registration or password change succeeds
      const result = await dispatch(
        registerViaEmail({ email, verifyCode, password })
      );
      if (registerViaEmail.fulfilled.match(result)) {
        setCurrentForm(FormType.Login);
      }
    } else if (currentForm === FormType.ChangePassword) {
      const result = await dispatch(
        changePassword({ email, verifyCode, password })
      );
      if (changePassword.fulfilled.match(result)) {
        setCurrentForm(FormType.Login);
      }
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [countdown]);

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
                text={
                  countdown > 0 ? countdown.toString() : "Verification Code"
                }
                method={handleRequestVerificationCode}
                loading={loading}
                disabled={!isEmailValid || countdown > 0}
                variant="contained"
                sx={{
                  borderRadius: 10,
                  width: "50%",
                  marginTop: "0.3rem",
                  marginLeft: "0.6rem",
                  height: "3rem",
                  fontSize: "0.75rem",
                }}
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
              marginBottom: "0.5rem",
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
          <Box
            sx={{
              marginBottom: "1rem",
            }}
          >
            <Typography variant="caption" sx={{ color: NAV_TEXT_COLOUR }}>
              By signing up, you agree to the user policy.
            </Typography>
          </Box>
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
