import { StoryType } from "../type/story.type";
import { ChapterType } from "../type/chapter.type";
import { login } from "./handler/login";
import { shareStory } from "./handler/share-story";
import { closeStory } from "./handler/close-story";
import { IMessage } from "./type/request";
import { requestAccess } from "./handler/request-access";
import { ServerWebSocket, WebSocketHandler } from "bun";
import { v4 } from "uuid";
import { IResponse } from "./type/response";
import { getSharedStories } from "./handler/get-shared-stories";
import { answerRequest } from "./handler/answer-request";

export interface IUserOnline {
  login: string;
  id: string;
  session: ServerWebSocket<unknown>;
}
export interface ISharedStory {
  id: string;
  story: StoryType;
  chapters: ChapterType[];
  owner: IUserOnline;
  editors: IUserOnline[];
  editorsOnline: IUserOnline[];
}
export interface IGrantRequest {
  id: string;
  storyId: string;
  userId: string;
}

export let users: IUserOnline[] = [];
export let stories: ISharedStory[] = [];
export let requests: IGrantRequest[] = [];

export const registerWs = (): WebSocketHandler<unknown> => {
  return {
    message(ws, message) {
      const msg = JSON.parse(message as string) as IMessage;
      let resp: object;

      if (!users.some((user) => user.id === msg.id)) {
        ws.send(
          JSON.stringify({
            type: "ERROR",
            error: { data: "NOT_AUTHENTICATED" },
          } as IResponse)
        );
        return;
      }

      switch (msg.type) {
        case "LOGIN":
          resp = login(msg, ws);
          break;
        case "SHARE_STORY":
          resp = shareStory(msg, ws);
          break;
        case "CLOSE_STORY":
          resp = closeStory(msg, ws);
          break;
        case "REQUEST_ACCESS":
          resp = requestAccess(msg, ws);
          break;
        case "GET_SHARED_STORIES":
          resp = getSharedStories(msg, ws);
          break;
        case "ANSWER_REQUEST":
          resp = answerRequest(msg, ws);
          break;
        default:
          resp = {
            type: "ERROR",
            error: { data: "NOT_IMPLEMENTED" },
          } as IResponse;
          break;
      }
      ws.send(JSON.stringify(resp));
    },
    open(ws) {
      const id = v4();
      users.push({
        login: "",
        id,
        session: ws,
      });

      ws.send(
        JSON.stringify({
          type: "CONNECT",
          connect: {
            id,
          },
        } as IResponse)
      );
    },
    close(ws, code, message) {
      const user = users.find((user) => user.session === ws);
      console.log(`User ${user?.login} disconnected`);

      stories = stories.filter((story) => story.owner !== user);

      users = users.filter((user) => user.session !== ws);
    },
    drain(ws) {}, // the socket is ready to receive more data
  };
};
