import { NextApiRequest, NextApiResponse } from "next";

import CONFIG from "../../../config";

import {
  XY3BackendResponse,
  PLATFORM_ROUTE,
} from "../../../interfaces/XY3BackendResponse";
import { makeFetchRequestToXY3Backend } from "../../../utils/api";

const { XY3_BACKEND_URL } = CONFIG;

const EMAIL_LOGIN_PATH = "/EmailLogin";

const handleRequestVerificationCode = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const url = `${XY3_BACKEND_URL}${PLATFORM_ROUTE}${EMAIL_LOGIN_PATH}`;

  const { status, result } = await makeFetchRequestToXY3Backend(url, req.body);

  res.status(status).json(result);
};

export default handleRequestVerificationCode;
