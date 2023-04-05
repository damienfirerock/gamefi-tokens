import React, { useMemo, Suspense } from "react";
import dynamic from "next/dynamic";
import { Box, BoxProps, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/router";

import Layout from "../layout/Layout";
import StyledCircularProgress from "../common/StyledCircularProgress";
import Listing from "../marketplace/Listing";

import NFT_COLLECTIONS from "../../constants/nft-collections";
import { Locale } from "../../interfaces/locale";
import { Collection } from "../../interfaces/INFTAttributes";

const StyledBox = styled(Box)<BoxProps>(() => ({
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "space-evenly",
}));

const CollectionEnumValues: string[] = Object.values(Collection);

const Marketplace: React.FunctionComponent = () => {
  const router = useRouter();
  const { locale } = router;

  const { tokenId, collection } = router.query;

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
  // link payment to mint

  return (
    <Layout>
      <Typography variant="h1">Marketplace</Typography>
      <StyledBox>
        {tokenDetails.map((details) => (
          <Listing key={details.tokenId} {...details} />
        ))}
      </StyledBox>
    </Layout>
  );
};

export default Marketplace;
