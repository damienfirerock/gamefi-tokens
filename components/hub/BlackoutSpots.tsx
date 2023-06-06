import React from "react";
import { Box } from "@mui/material";

const BlackoutSpots: React.FunctionComponent = () => {
  return (
    <Box sx={{ position: "relative", display: "block", zIndex: 1 }}>
      <Box
        sx={{
          position: "absolute",
          background: "black",
          height: "1.5rem",
          width: "1.5rem",
          borderRadius: "1rem",
          top: "-0.75rem",
          right: "-0.75rem",
          zIndex: 1,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          background: "black",
          height: "1.5rem",
          width: "1.5rem",
          borderRadius: "1rem",
          top: "-0.75rem",
          left: "-0.75rem",
          zIndex: 1,
        }}
      />
    </Box>
  );
};

export default BlackoutSpots;
