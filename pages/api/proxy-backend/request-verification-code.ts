import { NextApiRequest, NextApiResponse } from "next";

import CONFIG from "../../../config";

import { PLATFORM_ROUTE } from "../../../interfaces/XY3BackendResponse";
import { makeFetchRequestToXY3Backend } from "../../../utils/api";

const { XY3_BACKEND_URL } = CONFIG;

const GET_VERIFY_TOKEN_PATH = "/GetVerifyCode";

const handleRequestVerificationCode = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const url = `${XY3_BACKEND_URL}${PLATFORM_ROUTE}${GET_VERIFY_TOKEN_PATH}`;

  const { status, result } = await makeFetchRequestToXY3Backend(url, req.body);

  res.status(status).json(result);
};

export default handleRequestVerificationCode;
