import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { IconButton } from "@mui/material";
import ChevronLeftOutlinedIcon from "@mui/icons-material/ChevronLeftOutlined";

import InteractButton from "../../common/InteractButton";
import PasswordField from "../../common/fields/PasswordField";
import DefaultField from "../../common/fields/DefaultField";

import { RootState } from "../../../store";
import { NAV_TEXT_COLOUR } from "../../../src/theme";

// TODO: Update when localisation is done
enum FormType {
  Login = "Login",
  Register = "Register",
  ChangePassword = "Change Password",
}

interface FormFields {
  email: string;
  verificationCode: string;
  password: string;
  repeatPassword: string;
}

const LoginDialogForm: React.FunctionComponent = () => {
  const { handleSubmit, control } = useForm<FormFields>();

  const authSlice = useSelector((state: RootState) => state.auth);
  const { loading } = authSlice;

  const [currentForm, setCurrentForm] = useState<FormType>(FormType.Login);

  const handleChangeOption = (option: FormType) => {
    setCurrentForm(option);
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

      {/* TextFields */}
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <DefaultField name="email" label="Email" control={control} />
        {currentForm !== FormType.Login && (
          <DefaultField
            name="verificationCode"
            label="Verification Code"
            control={control}
          />
        )}
        <PasswordField name="password" label="password" control={control} />
        {currentForm !== FormType.Login && (
          <PasswordField
            name="repeatPassword"
            label="password (repeat)"
            control={control}
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
      />
    </>
  );
};

export default LoginDialogForm;
