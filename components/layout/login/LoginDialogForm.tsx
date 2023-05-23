import React from "react";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";

import InteractButton from "../../common/InteractButton";
import PasswordField from "../../common/fields/PasswordField";
import DefaultField from "../../common/fields/DefaultField";

import { RootState } from "../../../store";
import { NAV_TEXT_COLOUR } from "../../../src/theme";

interface FormFields {
  password: string;
}

const LoginDialogForm: React.FunctionComponent = () => {
  const { handleSubmit, control } = useForm<FormFields>();

  const authSlice = useSelector((state: RootState) => state.auth);
  const { loading } = authSlice;

  return (
    <>
      {/* TextFields */}
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <DefaultField name="email" label="Email" control={control} />
        <PasswordField name="password" label="password" control={control} />
      </Box>

      {/* Additional Player Options */}
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
          method={() => {
            return null;
          }}
          loading={loading}
          variant="text"
          size="small"
          sx={{ color: NAV_TEXT_COLOUR }}
        />
        <InteractButton
          text="忘记密码？"
          method={() => {
            return null;
          }}
          loading={loading}
          variant="text"
          size="small"
          sx={{ color: NAV_TEXT_COLOUR }}
        />
      </Box>

      {/* Login Button */}
      <InteractButton
        text="Login"
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
