import React, { useEffect } from "react";
import {
  Box,
  BoxProps,
  Button,
  Container,
  ContainerProps,
  Link,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import Layout from "../layout/Layout";
import WelcomeModal from "../layout/WelcomeModal";
import { StyledCircularProgress } from "../product/common/PokemonCard";

import useSequenceWallet from "../../utils/hooks/useSequenceWallet";

// https://github.com/vercel/next.js/issues/19420
const NEXT_PUBLIC_POLYGONSCAN_URL = process.env.NEXT_PUBLIC_POLYGONSCAN_URL;
const NEXT_PUBLIC_MULTISIG_ADDRESS = process.env.NEXT_PUBLIC_MULTISIG_ADDRESS;
const NEXT_PUBLIC_FIRE_ROCK_GOLD_ADDRESS =
  process.env.NEXT_PUBLIC_FIRE_ROCK_GOLD_ADDRESS;

const StyledBox = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  margin: theme.spacing(4, 0),
}));

const ContractsBox = styled(Box)<BoxProps>(() => ({
  textAlign: "center",
}));

const InteractButton = (props: {
  text: string;
  method: () => void;
  loading: boolean;
}) => {
  const { text, method, loading } = props;
  return (
    <Button variant="outlined" onClick={method} disabled={loading}>
      {text}
      {loading && <StyledCircularProgress size={24} />}
    </Button>
  );
};

const StyledContainer = styled(Container)<ContainerProps>(({ theme }) => ({
  marginTop: theme.spacing(1),
}));

const MainPage: React.FunctionComponent = () => {
  const {
    isWalletConnected,
    loading,
    connect,
    disconnect,
    openWallet,
    openWalletWithSettings,
    closeWallet,
  } = useSequenceWallet();

  return (
    <Layout>
      {/* Header */}
      <StyledContainer>
        <StyledBox>
          <Typography variant="h2">
            {isWalletConnected ? "Wallet Connected" : "Wallet not Connected"}
          </Typography>
        </StyledBox>
        <StyledBox>
          {isWalletConnected ? (
            <InteractButton
              text="Dis-Connect"
              method={disconnect}
              loading={loading}
            />
          ) : (
            <InteractButton
              text="Connect"
              method={() => connect(false, true)}
              loading={loading}
            />
          )}
        </StyledBox>

        {isWalletConnected && (
          <StyledBox>
            <InteractButton
              text="Open Wallet"
              method={openWalletWithSettings}
              loading={loading}
            />
          </StyledBox>
        )}

        <ContractsBox>
          <Typography variant="h3">Contracts</Typography>
          <Typography variant="h4">
            MultiSig Wallet:
            <Link
              href={`${NEXT_PUBLIC_POLYGONSCAN_URL}${NEXT_PUBLIC_MULTISIG_ADDRESS}#code`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {NEXT_PUBLIC_MULTISIG_ADDRESS}
            </Link>
          </Typography>
          <Typography variant="h4">
            $FRG Token:
            <Link
              href={`${NEXT_PUBLIC_POLYGONSCAN_URL}${NEXT_PUBLIC_FIRE_ROCK_GOLD_ADDRESS}#code`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {NEXT_PUBLIC_FIRE_ROCK_GOLD_ADDRESS}
            </Link>
          </Typography>
        </ContractsBox>
      </StyledContainer>
      <WelcomeModal />
    </Layout>
  );
};

export default MainPage;
