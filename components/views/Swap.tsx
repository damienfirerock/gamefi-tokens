import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { Box } from "@mui/material";

import Layout from "../layout/Layout";
import StyledCircularProgress from "../common/StyledCircularProgress";

// Decreases First Load from 366kb to 312kb
const DynamicSwapInformation = dynamic(() => import("../swap/SwapInformation"));

const Swap: React.FunctionComponent = () => {
  return (
    <Layout>
      {/* Header */}
      <Box>
        <Suspense fallback={<StyledCircularProgress />}>
          <DynamicSwapInformation />
        </Suspense>
      </Box>
    </Layout>
  );
};

export default Swap;
