import { NextApiResponse } from "next";

export const runtime = "edge";

export default async (res: NextApiResponse) => {
  res.status(200).json({
    error: "Понимаешь что такое API?",
    body: "Пиши в Discord!",
  });
};
