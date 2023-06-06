import React, { useState } from "react";
import { Controller, Control } from "react-hook-form";
import { IconButton, InputAdornment } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import StyledTextField from "./StyledField";

interface PasswordFieldProps {
  control: Control<any, any>;
  name: string;
  label: string;
  error?: string | null;
}

const PasswordField: React.FunctionComponent<PasswordFieldProps> = ({
  control,
  name,
  label,
  error = null,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      render={({ field }) => (
        <StyledTextField
          {...field}
          name={name}
          label={label}
          type={showPassword ? "text" : "password"}
          error={Boolean(error)}
          helperText={error}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      )}
    />
  );
};

export default PasswordField;
