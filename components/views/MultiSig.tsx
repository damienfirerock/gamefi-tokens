import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import {
  Box,
  BoxProps,
  Container,
  ContainerProps,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";

import Layout from "../layout/Layout";
import StyledCircularProgress from "../common/StyledCircularProgress";
import AlertBar from "../common/AlertBar";

import { AppDispatch, RootState } from "../../store";
import { clearError } from "../../features/TransactionSlice";
import { clearError as clearMultiSigError } from "../../features/MultiSigSlice";
import { clearError as clearDecodedDataError } from "../../features/TransactionSlice";

// Dynamic Import currently decreases First Load from 324kb to 270kb
const DynamicMultiSigInformation = dynamic(
  () => import("../multisig/MultiSigInformation")
);

const StyledContainer = styled(Container)<ContainerProps>(({ theme }) => ({
  marginTop: theme.spacing(1),
  textAlign: "center",
}));

const StyledBox = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  margin: theme.spacing(2, 0),
}));

const MultiSig: React.FunctionComponent = () => {
  const dispatch = useDispatch<AppDispatch>();

  const transactionSlice = useSelector((state: RootState) => state.transaction);
  const { error } = transactionSlice;

  const multiSigSlice = useSelector((state: RootState) => state.multiSig);
  const { error: multiSigError } = multiSigSlice;

  const decodedDataSlice = useSelector((state: RootState) => state.decodedData);
  const { error: decodedDataError } = decodedDataSlice;

  const handleClearAlert = () => {
    if (multiSigError) {
      dispatch(clearMultiSigError());
    } else if (decodedDataError) {
      dispatch(clearDecodedDataError());
    } else if (error) {
      dispatch(clearError());
    }
  };

  return (
    <Layout>
      {/* Header */}
      <StyledContainer>
        <StyledBox>
          <Typography variant="h2">MultiSig Transactions</Typography>
        </StyledBox>

        <Suspense fallback={<StyledCircularProgress />}>
          <DynamicMultiSigInformation />
        </Suspense>
      </StyledContainer>

      <AlertBar
        severity="warning"
        text={error || multiSigError || decodedDataError}
        handleClearAlertSource={handleClearAlert}
      />
    </Layout>
  );
};

export default MultiSig;
