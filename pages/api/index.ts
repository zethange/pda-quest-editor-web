import { NextApiRequest, NextApiResponse } from "next";

const secret = process.env.SECRET;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json({
    error: "Любишь шастать по API?",
    body: "Пиши в Discord!",
  });
};
