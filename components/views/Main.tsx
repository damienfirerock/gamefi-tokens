import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import {
  Box,
  BoxProps,
  Container,
  ContainerProps,
  Link,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";

import Layout from "../layout/Layout";
import AlertBar from "../common/AlertBar";
import StyledCircularProgress from "../common/StyledCircularProgress";

import { AppDispatch, RootState } from "../../store";
import CONFIG, { CONTRACT_ADDRESSES, ADDRESS_NAMES } from "../../config";
import { clearError } from "../../features/TransactionSlice";
import { clearError as clearAirdropError } from "../../features/AirdropSlice";

const addresses = Object.values(CONTRACT_ADDRESSES);

const StyledContainer = styled(Container)<ContainerProps>(({ theme }) => ({
  marginTop: theme.spacing(1),
  textAlign: "center",
}));

const ContractsBox = styled(Box)<BoxProps>(({ theme }) => ({
  margin: theme.spacing(2, 0),
}));

// Decreases First Load from 366kb to 312kb
const DynamicAirdropInformation = dynamic(
  () => import("../airdrop/AirdropInformation")
);

const Main: React.FunctionComponent = () => {
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
        {/* <Suspense fallback={<StyledCircularProgress />}>
          <DynamicAirdropInformation />
        </Suspense> */}
        <ContractsBox>
          <Typography variant="h3">Addresses</Typography>
          {addresses.map((address) => {
            if (!address) return;
            return (
              <Typography
                variant="h4"
                key={address}
                sx={{ display: "inline-flex", alignItems: "center" }}
              >
                {ADDRESS_NAMES[address]}:
                <Link
                  href={`${CONFIG.POLYGONSCAN_URL}${address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {address}
                </Link>
              </Typography>
            );
          })}
        </ContractsBox>
      </StyledContainer>

      <AlertBar
        severity="warning"
        text={error || airdropError}
        handleClearAlertSource={handleClearAlert}
      />
    </Layout>
  );
};

export default Main;
