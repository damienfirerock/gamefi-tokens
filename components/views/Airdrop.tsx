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
import AirdropInformation from "../airdrop/AirdropInformation";

import { AppDispatch, RootState } from "../../store";
import { clearError } from "../../features/TransactionSlice";
import { clearError as clearAirdropError } from "../../features/AirdropSlice";
import { clearError as clearDecodedDataError } from "../../features/TransactionSlice";

const StyledContainer = styled(Container)<ContainerProps>(({ theme }) => ({
  marginTop: theme.spacing(1),
  textAlign: "center",
}));

const StyledBox = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  margin: theme.spacing(2, 0),
}));

const Airdrop: React.FunctionComponent = () => {
  const dispatch = useDispatch<AppDispatch>();

  const transactionSlice = useSelector((state: RootState) => state.transaction);
  const { error } = transactionSlice;

  const airdropSlice = useSelector((state: RootState) => state.airdrop);
  const { error: airdropError } = airdropSlice;

  const handleClearAlert = () => {
    if (airdropError) {
      dispatch(clearAirdropError());
    } else if (error) {
      dispatch(clearError());
    }
  };

  return (
    <Layout>
      {/* Header */}
      <StyledContainer>
        <AirdropInformation />
      </StyledContainer>

      <AlertBar
        severity="warning"
        text={error || airdropError}
        handleClearAlertSource={handleClearAlert}
      />
    </Layout>
  );
};

export default Airdrop;
