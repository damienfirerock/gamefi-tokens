import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { Container, ContainerProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";

import Layout from "../layout/Layout";
import AlertBar from "../common/AlertBar";
import StyledCircularProgress from "../common/StyledCircularProgress";

import { AppDispatch, RootState } from "../../store";
import { clearError } from "../../features/TransactionSlice";
import { clearError as clearAirdropError } from "../../features/AirdropSlice";

const StyledContainer = styled(Container)<ContainerProps>(({ theme }) => ({
  marginTop: theme.spacing(1),
  textAlign: "center",
}));

// Decreases First Load from 366kb to 312kb
const DynamicAirdropInformation = dynamic(
  () => import("../airdrop/AirdropInformation")
);

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
        <Suspense fallback={<StyledCircularProgress />}>
          <DynamicAirdropInformation />
        </Suspense>
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
