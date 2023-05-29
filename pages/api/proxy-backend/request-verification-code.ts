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

type Override<T1, T2> = Omit<T1, keyof T2> & T2;

const handleWithdrawFRGCrystal = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  console.log("trying");
  try {
    const { body } = req;
    const url = `${XY3_BACKEND_URL}${PLATFORM_ROUTE}${GET_VERIFY_TOKEN_PATH}`;
    const response: {
      success: boolean;
      txnHash?: string;
      error?: any;
    } = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
    }).then((res) => res.json());

    console.log({ response, body, url });

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Approve Transaction Failed",
    });
  }
};

export default handleWithdrawFRGCrystal;
