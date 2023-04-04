import { NextApiRequest, NextApiResponse } from "next";

import ENGLISH_TOKEN_IDS from "../../../../../../constants/nft/skins/en/token-ids";

const handleSkinEnglishJSON = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const id = req.query.id;

  if (!id || typeof id === "object") {
    return res.status(404).json({ error: true, message: "Item not found" });
  }

  const data = ENGLISH_TOKEN_IDS[parseInt(id)];

  if (!data) {
    res.status(404).json({ error: true, message: "Item not found" });
  }

  res.status(200).json(data);
};

export default handleSkinEnglishJSON;
