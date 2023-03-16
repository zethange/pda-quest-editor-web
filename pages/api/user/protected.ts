import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (session) {
    return res.send({
      content: "Защищенная страница типа",
    });
  }

  res.send({
    error: "У вас нет доступа к репозиторию. Вы должны войти в свой аккаунт.",
  });
}
