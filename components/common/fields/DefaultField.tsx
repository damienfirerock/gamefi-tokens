import React from "react";
import { Controller, Control } from "react-hook-form";

import StyledTextField from "./StyledField";

interface DefaultFieldProps {
  control: Control<any, any>;
  name: string;
  label: string;
  type?: string;
}

const DefaultField: React.FunctionComponent<DefaultFieldProps> = ({
  control,
  name,
  label,
  type = "text",
}) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      render={({ field }) => (
        <StyledTextField {...field} name={name} label={label} type={type} />
      )}
    />
  );
};

export default DefaultField;
