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
import LuckyDrawCard from "../product/LuckyDrawCard";
import SkeletonPokemonCard from "../product/common/SkeletonPokemonCard";

import { RootState } from "../../store";
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

const LuckyDraw: React.FunctionComponent<{ data: IProduct[] }> = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { account } = useConnectWallet();

  const productsSlice = useSelector((state: RootState) => state.products);
  const { loading, data } = productsSlice;

  useEffect(() => {
    if (!account) return;

    dispatch(
      fetchProducts({
        tokenId: process.env.NEXT_PUBLIC_LUCKYDRAW_PRIZE_TOKEN_ID || "",
      })
    );
  }, [account]);

  return (
    <Layout>
      {/* Header */}
      <StyledContainer>
        <StyledBox>
          <Typography variant="h2">
            Lucky{" "}
            <Link
              href={
                "https://goerli.etherscan.io/address/0x473B25e90d67Dd5A312fb78dA4Ff15E3960EeD4F#code"
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              Draw
            </Link>
          </Typography>
        </StyledBox>
        <StyledBox>
          <Header
            text={loading ? "Getting Prize..." : "Current Prize:"}
            variant="h4"
          />
        </StyledBox>

        <CardsBox>
          {loading ? (
            <SkeletonPokemonCard />
          ) : data?.length ? (
            data.map((element) => (
              <LuckyDrawCard key={element.tokenId} {...element} />
            ))
          ) : (
            <Typography variant="h6">No prize currently :(</Typography>
          )}
        </CardsBox>
      </StyledContainer>
    </Layout>
  );
};

export default LuckyDraw;
