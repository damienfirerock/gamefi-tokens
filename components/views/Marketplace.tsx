import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import GooglePayButton from "@google-pay/button-react";

import Layout from "../layout/Layout";
import AlertBar from "../common/AlertBar";
import StyledCircularProgress from "../common/StyledCircularProgress";

import { AppDispatch, RootState } from "../../store";
import { clearError } from "../../features/TransactionSlice";
import { clearError as clearSwapError } from "../../features/SwapSlice";

const Marketplace: React.FunctionComponent = () => {
  const dispatch = useDispatch<AppDispatch>();

  const transactionSlice = useSelector((state: RootState) => state.transaction);
  const { error } = transactionSlice;

  const swapSlice = useSelector((state: RootState) => state.swap);
  const { error: swapError } = swapSlice;

  const handleClearAlert = () => {
    if (swapError) {
      dispatch(clearSwapError());
    } else if (error) {
      dispatch(clearError());
    }
  };

  return (
    <Layout>
      <Box>Marketplace</Box>

      <GooglePayButton
        environment="TEST"
        paymentRequest={{
          apiVersion: 2,
          apiVersionMinor: 0,
          allowedPaymentMethods: [
            {
              type: "CARD",
              parameters: {
                allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
                allowedCardNetworks: ["MASTERCARD", "VISA"],
              },
              tokenizationSpecification: {
                type: "PAYMENT_GATEWAY",
                parameters: {
                  gateway: "example",
                  gatewayMerchantId: "exampleGatewayMerchantId",
                },
              },
            },
          ],
          merchantInfo: {
            merchantId: "12345678901234567890",
            merchantName: "Demo Merchant",
          },
          transactionInfo: {
            totalPriceStatus: "FINAL",
            totalPriceLabel: "Total",
            totalPrice: "10.00",
            currencyCode: "USD",
            countryCode: "US",
          },
        }}
        onLoadPaymentData={(paymentRequest) => {
          console.log("load payment data", paymentRequest);
        }}
      />

      <AlertBar
        severity="warning"
        text={error || swapError}
        handleClearAlertSource={handleClearAlert}
      />
    </Layout>
  );
};

export default Marketplace;
