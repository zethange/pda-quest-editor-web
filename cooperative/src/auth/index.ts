import { Elysia } from "elysia";
import { v4 } from "uuid";
import { sessions } from "../database";

export const registerAuthRoutes = () => {
  const app = new Elysia();

  app.post("/api/auth/login", ({ body }) => {
    const { login } = body as {
      login: string;
    };

    const candidate = sessions.find((session) => session.login === login);
    if (candidate) {
      return {
        ok: false,
        msg: "Пользователь с таким логином уже вошёл",
      };
    }

    const userId = v4();
    sessions.push({
      id: userId,
      login: login,
      session: null,
    });

    return {
      ok: true,
      msg: "Сессия успешно создана",
      userId,
    };
  });

  return app;
};
