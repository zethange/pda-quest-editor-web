import { NextApiResponse } from "next";

export default async (res: NextApiResponse) => {
  res.status(200).json({
    error: "Понимаешь что такое API?",
    body: "Пиши в Discord!",
  });
};
