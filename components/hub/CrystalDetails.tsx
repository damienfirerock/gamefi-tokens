import React from "react";
import { Box, Typography } from "@mui/material";
import { useTranslation } from "next-i18next";
import { useSelector } from "react-redux";

import { RootState } from "../../store";
import { NAV_TEXT_COLOUR, VALUE_COLOUR } from "../../src/theme";

const CrystalDetails: React.FunctionComponent = () => {
  const { t } = useTranslation("crystal-hub");

  const accountSlice = useSelector((state: RootState) => state.account);
  const { frgCrystalBalance, pendingFrgCrystalBalance } = accountSlice;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "1rem",
        color: NAV_TEXT_COLOUR,
      }}
    >
      <Typography variant="caption">
        Mock FRG Crystal Balance:{" "}
        <Box component="span" sx={{ color: VALUE_COLOUR }}>
          {frgCrystalBalance}
        </Box>
      </Typography>
      <Typography variant="caption">
        Mock Pending FRG Crystal Balance:{" "}
        <Box component="span" sx={{ color: VALUE_COLOUR }}>
          {pendingFrgCrystalBalance}
        </Box>
      </Typography>
    </Box>
  );
};

export default CrystalDetails;
