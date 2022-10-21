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
import ProductCard from "../product/ProductCard";
import LoadingProductCards from "../product/LoadingProductCards";
import WelcomeModal from "../layout/WelcomeModal";

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

  useEffect(() => {
    if (!account) return;

    dispatch(fetchProducts({ owner: account }));
  }, [account]);

  return (
    <Layout>
      {/* Header */}
      <StyledContainer>
        <StyledBox>
          <Header
            text={loading ? "Getting Pokemon..." : "Pokemon Center"}
            variant="h2"
          />
        </StyledBox>

        {/* Pieces on Sale */}
        <CardsBox>
          {loading ? (
            <LoadingProductCards />
          ) : data?.length ? (
            data.map((element) => (
              <ProductCard key={element.tokenId} {...element} />
            ))
          ) : (
            <Typography variant="h6">You have no pokemon yet :(</Typography>
          )}
        </CardsBox>
      </StyledContainer>
      <WelcomeModal />
    </Layout>
  );
};

export default PokemonCenter;
