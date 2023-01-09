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
import WelcomeModal from "../layout/WelcomeModal";

import { RootState } from "../../store";
import { fetchProducts } from "../../features/ProductsSlice";
import { AppDispatch } from "../../store";

const StyledBox = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  margin: theme.spacing(4, 0),
}));

const StyledContainer = styled(Container)<ContainerProps>(({ theme }) => ({
  marginTop: theme.spacing(1),
}));

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
            {loading ? "Wallet Connected" : "Wallet not Connected"}
          </Typography>
        </StyledBox>
      </StyledContainer>
      <WelcomeModal />
    </Layout>
  );
};

export default MainPage;
