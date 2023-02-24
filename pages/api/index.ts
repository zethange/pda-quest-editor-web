import { NextApiResponse, NextApiRequest } from "next";

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  const method = _req.method;
  const query = _req.query;
  const headers = _req.headers;

  return res.status(200).json({
    message: "Что ты хочешь здесь увидеть?",
    method,
    query,
    headers,
    date: new Date(),
  });
}
