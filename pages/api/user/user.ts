import { getToken } from "next-auth/jwt";
import { NextApiRequest, NextApiResponse } from "next";

export const runtime = "edge";

const secret = process.env.SECRET;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const token = await getToken({ req, secret });
  if (token) {
    res.json(token);
  } else {
    res.status(401).send("Не авторизован");
  }
  res.end();
};
