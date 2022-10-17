import React, { useEffect } from "react";
import { Box, BoxProps, Container, ContainerProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";

import Layout from "../layout/Layout";
import { Header } from "../common";
import ProductCard from "../product/ProductCard";
import LoadingProductCards from "../product/LoadingProductCards";

import { RootState } from "../../store";
import { fetchProducts } from "../../features/ProductsSlice";
import { AppDispatch } from "../../store";
import { IProduct } from "../../interfaces/IProduct";
import usePurchaseNFT from "../../utils/hooks/usePurchaseNFT";

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

const MainPage: React.FunctionComponent<{ data: IProduct[] }> = () => {
  const dispatch = useDispatch<AppDispatch>();

  const productsSlice = useSelector((state: RootState) => state.products);
  const { loading, data, error } = productsSlice;

  const { purchaseNFT } = usePurchaseNFT();

  useEffect(() => {
    dispatch(fetchProducts());
  }, []);

  return (
    <Layout>
      {/* Header */}
      <StyledContainer>
        <StyledBox>
          <Header
            text={
              loading ? "Getting Pokemon..." : "These Pokemon are fighting fit!"
            }
            variant="h2"
          />
        </StyledBox>

        {/* Pieces on Sale */}
        <CardsBox>
          {loading ? (
            <LoadingProductCards />
          ) : (
            data?.map((element) => (
              <div key={element.tokenId}>
                <ProductCard
                  key={element.tokenId}
                  {...element}
                  handlePurchase={purchaseNFT}
                />
              </div>
            ))
          )}
        </CardsBox>
      </StyledContainer>
    </Layout>
  );
};

export default MainPage;
