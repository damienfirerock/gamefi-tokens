import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Container, Typography } from "@mui/material";
import dayjs from "dayjs";
import Image from "next/image";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";

import Layout from "../layout/Layout";

import {
  COINGECKO_GAMING_CATEGORY_ID,
  LOCAL_COINGECKO_PATH,
} from "../../constants/main";
import { formatNumberValue } from "../../utils/common";

type CategoryInfo = {
  content: string;
  id: string;
  market_cap: number;
  market_cap_change_24h: number;
  name: string;
  top_3_coins: string[];
  updated_at: string;
  volume_24h: number;
};

type GamingTokenInfo = {
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  circulating_supply: number;
  current_price: number;
  fully_diluted_valuation: number;
  high_24h: number;
  id: string;
  image: string;
  last_updated: string;
  low_24h: number;
  market_cap: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  market_cap_rank: number;
  max_supply: number;
  name: string;
  price_change_24h: number;
  price_change_percentage_24h: number;
  roi: null;
  symbol: string;
  total_supply: number;
  total_volume: number;
};

const Main: React.FunctionComponent = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [gamingCategoryData, setGamingCategoryData] =
    useState<CategoryInfo | null>(null);
  const [gamingTokensData, setGamingTokensData] = useState<
    GamingTokenInfo[] | null
  >(null);

  const getGamingCategoryInfo = async () => {
    const response: {
      success: boolean;
      data: CategoryInfo[];
    } = await fetch(`${LOCAL_COINGECKO_PATH}/categories-info`, {
      method: "POST",
      headers: { "content-type": "application/json" },
    }).then((res) => res.json());

    const { data } = response;

    const gamingCategory = data.find(
      (category) => category.id === COINGECKO_GAMING_CATEGORY_ID
    );

    if (gamingCategory) setGamingCategoryData(gamingCategory);
  };

  const getGamingTokensInfo = async () => {
    const response: {
      success: boolean;
      data: GamingTokenInfo[];
    } = await fetch(`${LOCAL_COINGECKO_PATH}/gaming-tokens`, {
      method: "POST",
      headers: { "content-type": "application/json" },
    }).then((res) => res.json());

    const { data } = response;
    console.log({ data });
    if (!!data.length) setGamingTokensData(data);
  };

  const getData = async () => {
    setLoading(true);
    await getGamingTokensInfo();
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  // const rows = gamingTokensData?.map(() => "lol") || [];
  const columns: GridColDef[] = [
    { field: "ath", headerName: "ATH" },
    { field: "atl", headerName: "ATL" },
    { field: "circulating_supply", headerName: "Circulating Supply" },
    { field: "current_price", headerName: "Current Price" },
    { field: "id", headerName: "ID" },
    { field: "image", headerName: "Image" },
    { field: "market_cap", headerName: "Market Cap" },
    { field: "max_supply", headerName: "Max Supply" },
    { field: "symbol", headerName: "Symbol" },
    { field: "total_supply", headerName: "Total Supply" },
  ];

  console.log({ gamingTokensData });

  return (
    <Layout>
      <Container maxWidth="lg">
        <Box>
          <Typography
            variant="h3"
            sx={{ marginY: "1rem", textAlign: "justify" }}
          >
            Gamefi Tokens Data {loading && <CircularProgress />}
          </Typography>
          <DataGrid rows={gamingTokensData || []} columns={columns} />
        </Box>
      </Container>
    </Layout>
  );
};

export default Main;
