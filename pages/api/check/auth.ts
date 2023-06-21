import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const body = req.body;

    await fetch(process.env.URL as string, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        embeds: [
          {
            description: atob(body),
          },
        ],
      }),
    });
    res.status(200).json(200);
  } else {
    res.status(400).json({
      error: "Bad method",
    });
  }
};
