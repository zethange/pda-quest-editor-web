import { v4 } from "uuid";
import { userOnlineList } from "..";
import { IMessage } from "../type/request";
import { IResponse } from "../type/response";
import { ServerWebSocket } from "bun";

export const login = (
  message: IMessage,
  ws: ServerWebSocket<unknown>
): IResponse => {
  const { id } = message;

  const userCandidate = userOnlineList.find(
    (item) => item.login === message.login?.login
  );
  if (userCandidate) {
    return {
      type: "LOGIN",
      login: {
        ok: false,
        data: "Already logged in",
      },
    };
  }

  const user = userOnlineList.find((item) => item.id === id);
  if (user && message.login) {
    user.login = message.login.login;
    console.log(`User ${user.login} logged in`);
    return {
      type: "LOGIN",
      login: {
        ok: true,
        data: "Successfully logged in",
      },
    };
  }

  return {
    type: "LOGIN",
    login: {
      ok: false,
      data: "Failed to login",
    },
  };
};
