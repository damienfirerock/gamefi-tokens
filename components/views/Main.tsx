import React, { useEffect } from "react";
import { Box, BoxProps, Container, ContainerProps } from "@mui/material";
import { styled } from "@mui/material/styles";

import Layout from "../layout/Layout";
import { Header } from "../common";

import { IProduct } from "../../interfaces/IProduct";

const StyledBox = styled(Box)<BoxProps>(() => ({
  display: "flex",
  justifyContent: "center",
}));

const StyledContainer = styled(Container)<ContainerProps>(({ theme }) => ({
  marginTop: theme.spacing(1),
}));

const MainPage: React.FunctionComponent<{ data: IProduct[] }> = ({ data }) => {
  return (
    <Layout>
      {/* Header */}
      <StyledContainer>
        <StyledBox>
          <Header text="These Pokemon are fighting fit!" variant="h2" />
        </StyledBox>
      </StyledContainer>

      {/* Pieces on Sale */}
      {data.map((element) => element.name)}
    </Layout>
  );
};

export default MainPage;
