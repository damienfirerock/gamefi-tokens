import React, { useEffect } from "react";
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
import { Header } from "../common";
import DepositCard from "../product/DepositCard";
import WithdrawCard from "../product/WithdrawCard";
import LoadingPokemonCards from "../product/LoadingPokemonCards";
import WelcomeModal from "../layout/WelcomeModal";

import { RootState } from "../../store";
import { fetchDeposits } from "../../features/DepositsSlice";
import { fetchProducts } from "../../features/ProductsSlice";
import { AppDispatch } from "../../store";
import { IProduct } from "../../interfaces/IProduct";
import useConnectWallet from "../../utils/hooks/useConnectWallet";

const StyledBox = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  margin: theme.spacing(4, 0),
}));

const StyledContainer = styled(Container)<ContainerProps>(({ theme }) => ({
  marginTop: theme.spacing(1),
}));

const CardsBox = styled(Container)<ContainerProps>(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "space-around",
}));

const PokemonCenter: React.FunctionComponent<{ data: IProduct[] }> = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { account } = useConnectWallet();

  const productsSlice = useSelector((state: RootState) => state.products);
  const { loading, data } = productsSlice;

  const depositsSlice = useSelector((state: RootState) => state.deposits);
  const { loading: depositsLoading, data: despositsData } = depositsSlice;

  useEffect(() => {
    if (!account) return;

    dispatch(fetchDeposits({ owner: account }));
    dispatch(fetchProducts({ owner: account }));
  }, [account]);

  useEffect(() => {
    if (!account || data === null) return;

    dispatch(fetchDeposits({ owner: account }));
  }, [data?.length]);

  return (
    <Layout>
      {/* Header */}
      <StyledContainer>
        <StyledBox>
          <Header text={"Pokemon Center"} variant="h2" />
        </StyledBox>
        <StyledBox>
          <Header
            text={loading ? "Getting your Pokemon..." : "Your Pokemon"}
            variant="h4"
          />
        </StyledBox>

        {/* Owned Pokemon */}
        <CardsBox>
          {loading ? (
            <LoadingPokemonCards />
          ) : data?.length ? (
            data.map((element) => (
              <DepositCard key={element.tokenId} {...element} />
            ))
          ) : (
            <Typography variant="h6">You have no pokemon yet :(</Typography>
          )}
        </CardsBox>

        <StyledBox>
          <Header
            text={
              loading
                ? "Getting deposited Pokemon..."
                : "Your deposited Pokemon"
            }
            variant="h4"
          />
        </StyledBox>

        {/* Deposited Pokemon */}
        <CardsBox>
          {depositsLoading ? (
            <LoadingPokemonCards />
          ) : despositsData?.length ? (
            despositsData.map((element) => (
              <WithdrawCard key={element.tokenId} {...element} />
            ))
          ) : (
            <Typography variant="h6">
              You have not deposited any pokemon yet :(
            </Typography>
          )}
        </CardsBox>
      </StyledContainer>
      <WelcomeModal />
    </Layout>
  );
};

export default PokemonCenter;
