import { NextApiRequest, NextApiResponse } from "next";
import { log } from "next-axiom";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    log.info("User logged in", {
      credentials: atob(req.headers.authorization!.split(" ")[1]),
      ip: req.connection.remoteAddress,
    });
    res.status(200).json(200);
  } else {
    res.status(400).json({
      error: "Bad method",
    });
  }
};
