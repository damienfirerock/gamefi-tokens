import React, { useEffect, useState } from "react";
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
import SkeletonPokemonCard from "../product/common/SkeletonPokemonCard";
import DepositCard from "../product/DepositCard";

import { AppDispatch, RootState } from "../../store";
import { fetchProducts } from "../../features/ProductsSlice";
import { fetchMarketPlace } from "../../features/MarketPlaceSlice";
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

const { NEXT_PUBLIC_MARKETPLACE_ADDRESS } = process.env;

const LuckyDraw: React.FunctionComponent<{ data: IProduct[] }> = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { account } = useConnectWallet();

  const marketPlacelice = useSelector((state: RootState) => state.marketPlace);
  const { loading: marketLoading, data: marketData } = marketPlacelice;

  const productsSlice = useSelector((state: RootState) => state.products);
  const { loading, data } = productsSlice;

  useEffect(() => {
    if (!account) return;

    dispatch(fetchProducts({ owner: account }));
    dispatch(fetchMarketPlace({ owner: NEXT_PUBLIC_MARKETPLACE_ADDRESS }));
  }, [account]);

  return (
    <Layout>
      {/* Header */}
      <StyledContainer>
        <StyledBox>
          <Typography variant="h2">
            Market{" "}
            <Link
              href={`https://goerli.etherscan.io/address/${NEXT_PUBLIC_MARKETPLACE_ADDRESS}#code`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Place
            </Link>
          </Typography>
        </StyledBox>
        <StyledBox>
          <Header
            text={
              marketLoading ? "Getting Market Data..." : "Available to Buy:"
            }
            variant="h4"
          />
        </StyledBox>

        <CardsBox>
          {marketLoading ? (
            <SkeletonPokemonCard />
          ) : marketData?.length ? (
            marketData.map((element) => (
              <DepositCard key={element.tokenId} {...element} />
            ))
          ) : (
            <Typography variant="h6">No listings currently :(</Typography>
          )}
        </CardsBox>

        <StyledBox>
          <Header
            // text={loading ? "Getting Prize..." : "Current Prize:"}
            text="Your Listings"
            variant="h4"
          />
        </StyledBox>

        {/* <CardsBox>
          {loading ? (
            <SkeletonPokemonCard />
          ) : marketData?.length ? (
            marketData.map((element) => (
              <DepositCard key={element.tokenId} {...element} />
            ))
          ) : (
            <Typography variant="h6">No listings currently :(</Typography>
          )}
        </CardsBox> */}

        <StyledBox>
          <Header
            text={loading ? "Getting your Pokemon..." : "Your Pokemon"}
            variant="h4"
          />
        </StyledBox>

        {/* Owned Pokemon */}
        <CardsBox>
          {loading ? (
            <SkeletonPokemonCard />
          ) : data?.length ? (
            data.map((element) => (
              <DepositCard key={element.tokenId} {...element} />
            ))
          ) : (
            <Typography variant="h6">You have no pokemon yet :(</Typography>
          )}
        </CardsBox>
      </StyledContainer>
    </Layout>
  );
};

export default LuckyDraw;
