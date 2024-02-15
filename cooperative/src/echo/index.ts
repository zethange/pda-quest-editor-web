import { Elysia } from "elysia";
import { sessions, stories } from "../database";
import EventEmitter from "node:stream";
import { toStoryType } from "../story/model";

export const eventEmitter = new EventEmitter();

export const registerEchoRoutes = (): Elysia => {
  const app = new Elysia();

  app.get("/echo", () => "WebSocket required");
  app.ws("/echo", {
    open(ws) {
      const userId = ws.data.query["userId"];
      console.log("User tried connect", userId);
      const user = sessions.find((session) => session.id === userId);
      if (!user) {
        ws.close();
        return;
      }

      user.session = ws;

      eventEmitter.on("data", (data) => {
        if (!ws) return;
        ws.send(data);
      });

      ws.send("whatsup");
    },
    message(ws, message) {
      console.log(message);
      const msg = message as {
        type: string;
      };

      if (msg.type == "getSharedStories") {
        ws.send(
          JSON.stringify({
            type: "stories",
            stories: stories.map(toStoryType),
          })
        );
        return;
      }
      // const data = JSON.parse(message as string);
    },
    close(ws) {
      const user = sessions.find((session) => session.session === ws);
      if (!user) return;

      user.session = null;
      sessions.splice(sessions.indexOf(user), 1);
    },
  });

  return app;
};
