import { NextApiRequest, NextApiResponse } from "next";
import cache from "memory-cache";

import CONFIG from "../../../config";
import { makeFetchRequestToCoinGecko } from "../../../utils/api";

const { COIN_GECKO_API_URL } = CONFIG;

const CACHE_DURATION = 60 * 1000; // Cache duration in milliseconds (1 minute)
const CACHE_KEY = "cachedResponse";

const MARKETS_PATH = "/coins/markets";

const url = new URL(`${COIN_GECKO_API_URL}${MARKETS_PATH}`);
const params = new URLSearchParams();
params.append("vs_currency", "usd");
params.append("category", "gaming");
params.append("order", "market_cap_desc");
params.append("per_page", "250");
params.append("page", "1");
params.append("sparkline", "false");
params.append("locale", "en");
url.search = params.toString();

// Note from CoinGecko:
// Our Public API has a rate limit of 10-30 calls per minute,
// if you exceed that limit you will be blocked until the next 1 minute window.

const handleGetCategoriesInfo = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  let cachedResponse = cache.get(CACHE_KEY);

  if (!cachedResponse) {
    const { status, result } = await makeFetchRequestToCoinGecko(
      url.toString(),
      req.body
    );
    cachedResponse = { status, result };
    cache.put(CACHE_KEY, cachedResponse, CACHE_DURATION);
  }

  res.status(cachedResponse.status).json(cachedResponse.result);
};

export default handleGetCategoriesInfo;
