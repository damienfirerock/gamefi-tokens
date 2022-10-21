import React, { useEffect } from "react";
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
import { Header } from "../common";
import DepositCard from "../product/DepositCard";
import WithdrawCard from "../product/WithdrawCard";
import LoadingPokemonCards from "../product/LoadingPokemonCards";
import PokePointBalance from "../pokepoint/PokePointsBalance";

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
  paddingBottom: theme.spacing(10),
}));

const CardsBox = styled(Container)<ContainerProps>(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
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
          <Typography variant="h2">
            Pokemon{" "}
            <Link
              href={
                "https://goerli.etherscan.io/address/0x473B25e90d67Dd5A312fb78dA4Ff15E3960EeD4F#code"
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              Center
            </Link>
          </Typography>
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

        <PokePointBalance />

        <StyledBox></StyledBox>
      </StyledContainer>
    </Layout>
  );
};

export default PokemonCenter;
