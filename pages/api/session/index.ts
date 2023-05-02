import { getSession } from "next-auth/react";
import { NextApiRequest, NextApiResponse } from "next";

const getUserSession = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (!session) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  // Continue with the request, as the user is authenticated
  res
    .status(200)
    .json({ message: "This is a protected route", user: session.user });
};

export default getUserSession;
