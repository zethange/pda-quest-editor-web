import { NextApiResponse } from "next";

const GET = async (res: NextApiResponse) => {
  const response = await fetch("https://cdn.artux.net/file_index.json");
  const data: string[] = await response.json();

  const allowExtension = ["mp3"];

  res.status(200).json(
    data.filter((str: string) => {
      const extension = str.split(".")[1];
      return allowExtension.includes(extension);
    })
  );
};

export default GET;
