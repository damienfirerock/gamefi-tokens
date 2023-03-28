import React, { useState } from "react";
import { Box, BoxProps, Button, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useTranslation } from "next-i18next";

import StyledCircularProgress from "../common/StyledCircularProgress";

const StyledBox = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  margin: theme.spacing(2, 0),
}));

const InteractButton = (props: {
  text: string;
  method: () => void;
  loading: boolean;
  disabled?: boolean;
}) => {
  const { text, method, loading, disabled = false } = props;
  return (
    <Button variant="outlined" onClick={method} disabled={loading || disabled}>
      {text}
      {loading && <StyledCircularProgress size={24} />}
    </Button>
  );
};

const AirdropInformation: React.FunctionComponent = () => {
  const { t } = useTranslation("airdrop");

  return <></>;
};

export default AirdropInformation;
