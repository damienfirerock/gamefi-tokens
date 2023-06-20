import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Container, Typography } from "@mui/material";
import dayjs from "dayjs";
import Image from "next/image";

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

  console.log({ gamingTokensData });

  return (
    <Layout>
      <Container maxWidth="lg">
        {/* {gamingTokensData && ( */}
        <Box>
          <Typography
            variant="h3"
            sx={{ marginY: "1rem", textAlign: "justify" }}
          >
            Gamefi Tokens Data {loading && <CircularProgress />}
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap" }}>
            {gamingTokensData?.map((token) => {
              const {
                ath,
                ath_date,
                atl,
                atl_date,
                circulating_supply,
                current_price,
                fully_diluted_valuation,
                high_24h,
                id,
                image,
                last_updated,
                low_24h,
                market_cap,
                market_cap_change_24h,
                market_cap_change_percentage_24h,
                market_cap_rank,
                max_supply,
                name,
                price_change_24h,
                price_change_percentage_24h,
                symbol,
                total_supply,
                total_volume,
              } = token;

              return (
                <Box
                  key={token.id}
                  sx={{
                    display: "inline",
                    margin: 1,
                    padding: "1rem",
                    border: "1px solid white",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      padding: 1,
                    }}
                  >
                    <Box
                      sx={{
                        background: "white",
                        padding: "0.75rem 0.75rem 0.25rem",
                        borderRadius: "50%",
                      }}
                    >
                      <Image alt={image} src={image} width={50} height={50} />
                    </Box>
                  </Box>
                  <Typography>Symbol: ${symbol.toUpperCase()}</Typography>
                  <Typography>
                    MarketCap: {formatNumberValue(market_cap)}
                  </Typography>
                  <Typography>
                    Circulating Supply: {formatNumberValue(circulating_supply)}
                  </Typography>
                  {/* <Typography>
                      Max Supply: {formatNumberValue(max_supply || 0)}
                    </Typography> */}
                  <Typography>Price (Current): US${current_price}</Typography>
                  <Typography>Price (ATH): US${ath}</Typography>
                  <Typography>Price (ATL): US${atl}</Typography>{" "}
                  <Typography>
                    ATH Date: {dayjs(ath_date).format("MMM D, YYYY h:mm A")}
                  </Typography>
                  <Typography>
                    ATL Date: {dayjs(atl_date).format("MMM D, YYYY h:mm A")}
                  </Typography>
                  {/* <Typography>
                    Volume (24hrs): {formatNumberValue(token.volume_24h)}
                  </Typography>
                  <Typography>
                    MarketCap Change (24hrs):{" "}
                    {token.market_cap_change_24h.toFixed(2)}%
                  </Typography>
                  <Typography>
                    Updated:{" "}
                    {dayjs(token.updated_at).format("ddd, MMM D, YYYY h:mm A")}
                  </Typography>
                   */}
                </Box>
              );
            })}
          </Box>
        </Box>
        {/* )} */}
      </Container>
    </Layout>
  );
};

export default Main;
