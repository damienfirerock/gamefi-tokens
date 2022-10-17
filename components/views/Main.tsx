import React from "react";
import { Box, BoxProps, Container, ContainerProps } from "@mui/material";
import { styled } from "@mui/material/styles";

import Layout from "../layout/Layout";
import { Header } from "../common";
import ProductCard from "../product/ProductCard";

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
  justifyContent: "space-between",
}));

const MainPage: React.FunctionComponent<{ data: IProduct[] }> = ({ data }) => {
  return (
    <Layout>
      {/* Header */}
      <StyledContainer>
        <StyledBox>
          <Header text="These Pokemon are fighting fit!" variant="h2" />
        </StyledBox>

        {/* Pieces on Sale */}
        <CardsBox>
          {data.map((element) => (
            <div key={element.tokenId}>
              <ProductCard key={element.tokenId} {...element} />
            </div>
          ))}
        </CardsBox>
      </StyledContainer>
    </Layout>
  );
};

export default MainPage;
