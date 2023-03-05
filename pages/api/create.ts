import { NextApiResponse, NextApiRequest } from "next";
import { addFeedback } from "@/pages/api/db";

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  const method = _req.method;

  const { date, content } = _req.body;

  if (method === "POST") {
    addFeedback({ content, date });

    return res.status(201).json({
      statusCode: 201,
      message: "Отзыв отправлен",
      body: { content, date },
    });
  } else {
    return res
      .status(400)
      .json({ statusCode: 400, message: "Метод не разрешен" });
  }
}
