import { NextApiRequest, NextApiResponse } from "next";
import { ethers } from "ethers";

import CONFIG from "../../../config";

const { XY3_BACKEND_URL } = CONFIG;

const PLATFORM_ROUTE = "/auth/platform";

const GET_VERIFY_TOKEN_PATH = "/GetVerifyCode";

const SOCIAL_LOGIN_PATH = "/ThirdLogin";

const EMAIL_LOGIN_PATH = "/EmailLogin";
const EMAIL_REGISTER_PATH = "/EmailRegister";
const RESET_PASSWORD_PATH = "/ResetAccountPassword";

const GET_UNION_ACCT_PATH = "/GetUnionAccount";

const handleRequestVerificationCode = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const { body } = req;
    const url = `${XY3_BACKEND_URL}${PLATFORM_ROUTE}${GET_VERIFY_TOKEN_PATH}`;

    const request: any = fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }).then((res) => res.json());

    const response: {
      code?: number;
      reason?: string;
      message?: string;
      metadata: any;
    } = await request;

    if (response?.code === 500)
      throw Error(response.reason || response.message);

    res.status(200).json({
      success: true,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || "Request Failed",
    });
  }
};

export default handleRequestVerificationCode;
