import React, { useMemo, Suspense } from "react";
import dynamic from "next/dynamic";
import { Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import GooglePayButton from "@google-pay/button-react";

import Layout from "../layout/Layout";
import AlertBar from "../common/AlertBar";
import StyledCircularProgress from "../common/StyledCircularProgress";

import { AppDispatch, RootState } from "../../store";
import { clearError } from "../../features/TransactionSlice";
import { clearError as clearSwapError } from "../../features/SwapSlice";
import NFT_COLLECTIONS from "../../constants/nft-collections";
import { Locale } from "../../interfaces/locale";
import { Collection } from "../../interfaces/INFTAttributes";

const CollectionEnumValues: string[] = Object.values(Collection);

const Marketplace: React.FunctionComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { locale } = router;

  const { tokenId, collection } = router.query;

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

  const tokenDetails = useMemo(() => {
    const nextLocale =
      locale === Locale.En || locale === Locale.Zh ? locale : Locale.En;

    // Note: Cannot filter tokenId without collection,
    // Different collections can use the same token id
    // Return all values if invalid collection value from query
    if (
      !collection ||
      typeof collection === "object" ||
      !CollectionEnumValues.includes(collection)
    ) {
      const values = Object.values(NFT_COLLECTIONS);
      const nextCollections = values.map((value) => value.info[nextLocale]);
      return nextCollections
        .map((collection) => Object.values(collection))
        .flat();
    }

    // If there is collection query, without tokenId,
    // Return the whole collection
    if (!tokenId || typeof tokenId === "object") {
      const collectionDetails =
        NFT_COLLECTIONS[collection as unknown as Collection]; // collection query is checked in if code above
      return Object.values(collectionDetails.info[nextLocale]);
    }

    // At this stage, collection and tokenIds should be valid
    const nextToken =
      NFT_COLLECTIONS[collection as unknown as Collection].info[nextLocale][
        parseInt(tokenId)
      ];
    return nextToken ? [nextToken] : [];
    // An empty array implies that there is no such token
  }, [locale, collection, tokenId]);

  console.log(tokenDetails);

  // map out available items based on cards

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
