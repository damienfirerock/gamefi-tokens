import React from "react";
import { Box, Card, CardProps, Typography } from "@mui/material";
import { useTranslation } from "next-i18next";
import { useSelector } from "react-redux";
import { styled } from "@mui/material/styles";

import { RootState } from "../../store";

import { NAV_TEXT_COLOUR, VALUE_COLOUR } from "../../src/theme";

export const StyledCard = styled(Card)<CardProps>(({ theme }) => ({
  color: NAV_TEXT_COLOUR,
  paddingTop: "1rem",
  paddingBottom: "1rem",
  borderBottom: "1px dashed #979797",
}));

const ExchangeInfo: React.FunctionComponent = () => {
  const { t } = useTranslation("crystal-hub");

  const hubSlice = useSelector((state: RootState) => state.hub);
  const { data: hubData } = hubSlice;
  const { rate, tax } = hubData!;

  return (
    <>
      <StyledCard variant="outlined">
        <Typography variant="body2">
          <Box component="span" sx={{ color: VALUE_COLOUR }}>
            {rate}
          </Box>{" "}
          FRG Crystal to{" "}
          <Box component="span" sx={{ color: VALUE_COLOUR }}>
            1
          </Box>{" "}
          $FRG
        </Typography>
        <Typography variant="body2">
          Withdrawal Tax Rate:{" "}
          <Box component="span" sx={{ color: VALUE_COLOUR }}>
            {tax}%
          </Box>
        </Typography>
      </StyledCard>
    </>
  );
};

export default ExchangeInfo;
