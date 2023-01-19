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
import ProductCard from "../product/ProductCard";
import LoadingPokemonCards from "../product/LoadingPokemonCards";

import { RootState } from "../../store";
import { fetchProducts } from "../../features/ProductsSlice";
import { AppDispatch } from "../../store";
import { IProduct } from "../../interfaces/IProduct";

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
  justifyContent: "center",
}));

// Destructuring here may cause error:
// 'ReferenceError: process is not defined'
const NEXT_PUBLIC_THUNDERDOME_NFT_ADDRESS =
  process.env.NEXT_PUBLIC_THUNDERDOME_NFT_ADDRESS;
const NEXT_PUBLIC_TOKEN_SALE_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_TOKEN_SALE_CONTRACT_ADDRESS;

const MainPage: React.FunctionComponent = () => {
  const dispatch = useDispatch<AppDispatch>();

  const productsSlice = useSelector((state: RootState) => state.products);
  const { loading, data, error } = productsSlice;

  useEffect(() => {
    dispatch(fetchProducts());
  }, []);

  return (
    <Layout>
      {/* Header */}
      <StyledContainer>
        <StyledBox>
          <Typography variant="h2">
            {loading ? (
              "Getting Pokemon..."
            ) : (
              <span>
                These{" "}
                <Link
                  href={`https://goerli.etherscan.io/address/${NEXT_PUBLIC_THUNDERDOME_NFT_ADDRESS}#code`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Pokemon
                </Link>{" "}
                are{" "}
                <Link
                  href={`https://testnets.opensea.io/collection/thunderdomenft`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  fighting
                </Link>{" "}
                <Link
                  href={`https://goerli.etherscan.io/address/${NEXT_PUBLIC_TOKEN_SALE_CONTRACT_ADDRESS}#code`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  fit
                </Link>
                !
              </span>
            )}
          </Typography>
        </StyledBox>

        {/* Pieces on Sale */}
        <CardsBox>
          {loading ? (
            <LoadingPokemonCards />
          ) : (
            data?.map((element) => (
              <ProductCard key={element.tokenId} {...element} />
            ))
          )}
        </CardsBox>
      </StyledContainer>
    </Layout>
  );
};

export default MainPage;
