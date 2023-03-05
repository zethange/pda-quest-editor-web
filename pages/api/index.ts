import { NextApiResponse, NextApiRequest } from "next";
import { feedbacks } from "@/pages/api/db";

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  return res.status(200).json(feedbacks);
}
