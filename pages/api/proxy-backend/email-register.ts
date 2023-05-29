import { NextApiRequest, NextApiResponse } from "next";

import CONFIG from "../../../config";

import { PLATFORM_ROUTE } from "../../../interfaces/XY3BackendResponse";
import { makeFetchRequestToXY3Backend } from "../../../utils/api";

const { XY3_BACKEND_URL } = CONFIG;

const EMAIL_REGISTER_PATH = "/EmailRegister";

const handleRequestVerificationCode = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const url = `${XY3_BACKEND_URL}${PLATFORM_ROUTE}${EMAIL_REGISTER_PATH}`;

  const { status, result } = await makeFetchRequestToXY3Backend(url, req.body);

  res.status(status).json(result);
};

export default handleRequestVerificationCode;
