import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const response = await fetch("https://cdn.artux.net/file_index.json");
  const data: string[] = await response.json();

  const allowExtension = [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "bmp",
    "webp",
    "svg",
    "tiff",
    "ico",
  ];

  res.status(200).json(
    data.filter((str: string) => {
      const extension = str.split(".")[1];
      return allowExtension.includes(extension);
    })
  );
};
