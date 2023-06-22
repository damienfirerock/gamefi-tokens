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
    {
      field: "image",
      headerName: "Image",
      width: 70,
      renderCell: (params) => (
        <Box sx={{ textAlign: "center", width: "100%" }}>
          <Box
            sx={{
              background: "white",
              padding: "0.4rem",
              borderRadius: "50%",
              display: "inline-flex",
            }}
          >
            <Image
              alt={params.value}
              src={params.value}
              width={35}
              height={35}
            />
          </Box>
        </Box>
      ),
    },
    {
      field: "symbol",
      headerName: "Token",
      width: 70,
      renderCell: (params) => params.value.toUpperCase(),
    },
    {
      field: "market_cap",
      width: 110,
      headerName: "Market Cap",
      renderCell: (params) => formatNumberValue(params.value),
    },
    {
      field: "current_price",
      headerName: "Current Price",
      width: 160,
      renderCell: (params) => <Typography>US${params.value}</Typography>,
    },
    {
      field: "ath",
      headerName: "ATH",
      width: 160,
      renderCell: (params) => <Typography>US${params.value}</Typography>,
    },
    {
      field: "atl",
      headerName: "ATL",
      width: 160,
      renderCell: (params) => <Typography>US${params.value}</Typography>,
    },
    {
      field: "circulating_supply",
      headerName: "Circulating Supply",
      width: 160,
      renderCell: (params) => formatNumberValue(params.value),
    },
    {
      field: "max_supply",
      headerName: "Max Supply",
      width: 160,
      renderCell: (params) =>
        params.value ? formatNumberValue(params.value) : "Infinite",
    },
  ];

  return (
    <Layout>
      <Typography variant="h3" sx={{ marginY: "1rem", textAlign: "justify" }}>
        Gamefi Tokens Data {loading && <CircularProgress />}
      </Typography>
      <DataGrid rows={gamingTokensData || []} columns={columns} />
    </Layout>
  );
};

export default Main;
