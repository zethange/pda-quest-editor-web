import { Elysia } from "elysia";
import { shareStory } from "./service";

export const registerStoryRoutes = (): Elysia => {
  const app = new Elysia();

  app.post("/api/story/share", ({ body, query: { userId } }) => {
    return shareStory(userId as string, body as any);
  });

  return app;
};
