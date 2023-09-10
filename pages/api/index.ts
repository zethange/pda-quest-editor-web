import { NextApiResponse } from "next";

const GET = async (res: NextApiResponse) => {
  res.status(200).json({
    error: "Что ты делаешь в моём холодильнике?",
  });
};

export default GET;
