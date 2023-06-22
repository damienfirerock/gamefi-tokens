import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import Image from "next/image";
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarQuickFilter,
  GridToolbarDensitySelector,
  GridToolbarExport,
} from "@mui/x-data-grid";

import Layout from "../layout/Layout";

import { LOCAL_COINGECKO_PATH } from "../../constants/main";
import { formatNumberValue } from "../../utils/common";

const CustomToolBar = () => {
  return (
    <GridToolbarContainer sx={{ background: "white", display: "flex" }}>
      <Box sx={{ flexGrow: 1 }}>
        <GridToolbarExport />
      </Box>
      <GridToolbarQuickFilter sx={{ marginBottom: 0 }} />
    </GridToolbarContainer>
  );
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

  const [gamingTokensData, setGamingTokensData] = useState<
    GamingTokenInfo[] | null
  >(null);

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
      width: 200,
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
      <DataGrid
        rows={gamingTokensData || []}
        columns={columns}
        rowHeight={75}
        slots={{ toolbar: CustomToolBar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
      />
    </Layout>
  );
};

export default Main;
