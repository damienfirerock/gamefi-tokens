import fs from "fs";
import path from "path";

import { NextApiRequest, NextApiResponse } from "next";

const handleImage = async (req: NextApiRequest, res: NextApiResponse) => {
  const id = req.query.id;

  try {
    const filePath = path.join(process.cwd(), `/public/nft-images/${id}.png`);
    const imageBuffer = fs.createReadStream(filePath);

    await new Promise(function (resolve) {
      res.setHeader("Content-Type", "image/png");
      imageBuffer.pipe(res);
      imageBuffer.on("end", resolve);
      imageBuffer.on("error", function (err: any) {
        if (err.code === "ENOENT") {
          res.status(400).json({
            error: true,
            message: "Image not found",
          });
          res.end();
        } else {
          res
            .status(500)
            .json({ error: true, message: "Sorry, something went wrong!" });
          res.end();
        }
      });
    });
  } catch (err) {
    res.status(400).json({ error: true, message: err });
    res.end();
  }
};

export default handleImage;
