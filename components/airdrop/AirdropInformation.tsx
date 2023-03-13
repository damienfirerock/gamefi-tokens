import React, { useState } from "react";
import { Box, BoxProps, Button, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useTranslation } from "next-i18next";

import StyledCircularProgress from "../common/StyledCircularProgress";
import SingleUseAirdrop from "./SingleUseAirdrop";
import CumulativeAirdrop from "./CumulativeAirdrop";

import { AirdropType } from "../../interfaces/IAirdrop";

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
  const [type, setType] = useState<AirdropType>(AirdropType.SINGLE_USE);
  const { t } = useTranslation("airdrop");

  const toggleType = () => {
    const nextType =
      type === AirdropType.SINGLE_USE
        ? AirdropType.CUMULATIVE
        : AirdropType.SINGLE_USE;
    setType(nextType);
  };

  return (
    <>
      <Box sx={{ marginTop: 5 }}>
        <InteractButton
          text={t("single")}
          method={toggleType}
          loading={false}
          disabled={type === AirdropType.SINGLE_USE}
        />
        <InteractButton
          text={t("cumulative")}
          method={toggleType}
          loading={false}
          disabled={type === AirdropType.CUMULATIVE}
        />
      </Box>

      <StyledBox>
        <Typography variant="h2">
          {type === AirdropType.SINGLE_USE ? t("single") : t("cumulative")}{" "}
          {t("airdrop-details")}
        </Typography>
      </StyledBox>

      {/* Show JSON file for the airdrop details */}
      {type === AirdropType.SINGLE_USE ? (
        <SingleUseAirdrop />
      ) : (
        <CumulativeAirdrop />
      )}
    </>
  );
};

export default AirdropInformation;
