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
import BiddingCard from "../product/BiddingCard";
import ListingCard from "../product/ListingCard";
import RemoveListingCard from "../product/RemoveListingCard";

import { AppDispatch, RootState } from "../../store";
import { fetchProducts } from "../../features/ProductsSlice";
import { fetchListings } from "../../features/ListingsSlice";
import { fetchMarketPlaceProducts } from "../../features/MarketPlaceProductsSlice";
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

  const marketPlaceProductsSlice = useSelector(
    (state: RootState) => state.marketPlaceProducts
  );
  const { loading: marketPlaceProductsLoading, data: marketPlaceProductsData } =
    marketPlaceProductsSlice;

  const listingsSlice = useSelector((state: RootState) => state.listings);
  const { loading: listingsLoading, data: listingsData } = listingsSlice;

  const productsSlice = useSelector((state: RootState) => state.products);
  const { loading, data } = productsSlice;

  useEffect(() => {
    if (!account) return;

    dispatch(fetchListings({ seller: account }));
  }, [account]);

  // Fetches User and MarketPlace Products after changes in marketPlaceProductsData
  // marketPlaceProductsData changes after initial fetch, as well as changes to number of listings
  useEffect(() => {
    if (!account) return;

    dispatch(
      fetchMarketPlaceProducts({ owner: NEXT_PUBLIC_MARKETPLACE_ADDRESS })
    );
    dispatch(fetchProducts({ owner: account }));
  }, [listingsData?.length, account]);

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
              marketPlaceProductsLoading
                ? "Getting Market Data..."
                : "Available to Buy:"
            }
            variant="h4"
          />
        </StyledBox>

        <CardsBox>
          {marketPlaceProductsLoading ? (
            <SkeletonPokemonCard />
          ) : marketPlaceProductsData?.length ? (
            marketPlaceProductsData.map((element) => (
              <BiddingCard key={element.tokenId} {...element} />
            ))
          ) : (
            <Typography variant="h6">
              No listings currently on the market place :(
            </Typography>
          )}
        </CardsBox>

        <StyledBox>
          <Header
            // text={loading ? "Getting Prize..." : "Current Prize:"}
            text="Your Listings"
            variant="h4"
          />
        </StyledBox>

        <CardsBox>
          {listingsLoading ? (
            <SkeletonPokemonCard />
          ) : listingsData?.length ? (
            listingsData.map((element) => (
              <RemoveListingCard key={element.tokenId} {...element} />
            ))
          ) : (
            <Typography variant="h6">No listings currently :(</Typography>
          )}
        </CardsBox>

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
              <ListingCard key={element.tokenId} {...element} />
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
