import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Container, Typography } from "@mui/material";
import dayjs from "dayjs";

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

const Main: React.FunctionComponent = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [gamingCategoryData, setGamingCategoryData] =
    useState<CategoryInfo | null>(null);

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

  const getData = async () => {
    setLoading(true);
    await getGamingCategoryInfo();
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  console.log({ gamingCategoryData });

  return (
    <Layout>
      <Container maxWidth="md">
        <Typography variant="h3" sx={{ marginY: "1rem", textAlign: "justify" }}>
          Gamefi Token Data {loading && <CircularProgress />}
        </Typography>

        {gamingCategoryData && (
          <Box>
            <Typography>
              MarketCap: {formatNumberValue(gamingCategoryData.market_cap)}
            </Typography>
            <Typography>
              Volume (24hrs): {formatNumberValue(gamingCategoryData.volume_24h)}
            </Typography>
            <Typography>
              MarketCap Change (24hrs):{" "}
              {gamingCategoryData.market_cap_change_24h.toFixed(2)}%
            </Typography>
            <Typography>
              Updated:{" "}
              {dayjs(gamingCategoryData.updated_at).format(
                "ddd, MMM D, YYYY h:mm A"
              )}
            </Typography>
          </Box>
        )}
      </Container>
    </Layout>
  );
};

export default Main;
