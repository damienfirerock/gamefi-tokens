import { NextApiRequest, NextApiResponse } from "next";

import CONFIG from "../../../config";
import { makeFetchRequestToCoinGecko } from "../../../utils/api";

const { COIN_GECKO_API_URL } = CONFIG;

const CATEGORIES_PATH = "/coins/categories";

const handleGetCategoriesInfo = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const url = `${COIN_GECKO_API_URL}${CATEGORIES_PATH}`;

  const { status, result } = await makeFetchRequestToCoinGecko(url, req.body);

  res.status(status).json(result);
};

export default handleGetCategoriesInfo;
