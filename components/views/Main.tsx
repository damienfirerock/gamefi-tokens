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
import WelcomeModal from "../layout/WelcomeModal";

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

const MainPage: React.FunctionComponent<{ data: IProduct[] }> = () => {
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
                  href={
                    "https://goerli.etherscan.io/address/0x16377628d5c50aE40951D63134572AB32395677C#code"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Pokemon
                </Link>{" "}
                are fighting{" "}
                <Link
                  href={
                    "https://goerli.etherscan.io/address/0xfF0Cc93e85150e18BA66102469d6e3613dC8Ef9B#code"
                  }
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
      <WelcomeModal />
    </Layout>
  );
};

export default MainPage;
