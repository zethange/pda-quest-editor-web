import { NextApiRequest, NextApiResponse } from "next";
import { log } from "next-axiom";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      var body = JSON.parse(req.body);
    } catch (e) {
      return res.status(400).send(JSON.stringify(e));
    }
    if (body.name && body.message && body.stack && body.router) {
      log.error("Error occurred", body);
    }
    return res.status(200).send(200);
  }
};
