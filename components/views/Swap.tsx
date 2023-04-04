import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import Layout from "../layout/Layout";
import StyledCircularProgress from "../common/StyledCircularProgress";

import { AppDispatch, RootState } from "../../store";
import { clearError } from "../../features/TransactionSlice";
import { clearError as clearSwapError } from "../../features/SwapSlice";

// Decreases First Load from 366kb to 312kb
const DynamicSwapInformation = dynamic(() => import("../swap/SwapInformation"));

const Swap: React.FunctionComponent = () => {
  const dispatch = useDispatch<AppDispatch>();

  const transactionSlice = useSelector((state: RootState) => state.transaction);
  const { error } = transactionSlice;

  const swapSlice = useSelector((state: RootState) => state.swap);
  const { error: swapError } = swapSlice;

  const handleClearAlert = () => {
    if (swapError) {
      dispatch(clearSwapError());
    } else if (error) {
      dispatch(clearError());
    }
  };

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
