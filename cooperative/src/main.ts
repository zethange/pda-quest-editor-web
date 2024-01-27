import { Elysia } from "elysia";
import { StoryType } from "./type/story.type";
import { ChapterType } from "./type/chapter.type";

const app = new Elysia();

interface IUserOnline {
  login: string;
  id: string;
}

const userOnlineList: IUserOnline[] = [];
const sharedChapterList: {
  id: number;
  password: string;
  story: StoryType;
  chapters: ChapterType[];
}[] = [];

interface IMessage {
  type: "LOGIN" | "SHARE_STORY";
  login?: {
    login: string;
  };
}

app.get("/", () => "Cooperative server for PDA Quest Editor");
app.ws("/ws", {
  open: (ws) => {
    userOnlineList.push({
      login: "",
      id: ws.id,
    });
  },
  message: (ws, message) => {
    const msg = message as IMessage;
    switch (msg.type) {
      case "LOGIN":
        userOnlineList.find((user) => user.id === ws.id)!.login =
          msg.login!.login;
        break;
    }
  },
  close: (ws, code, reason) => {
    const index = userOnlineList.findIndex((item) => item.id === ws.id);
    userOnlineList.splice(index, 1);
  },
});

setInterval(() => {
  console.log("Users: ", userOnlineList);
}, 1000);

app.listen(3000);

console.log(
  `🦊 Cooperative server is running at ${app.server?.hostname}:${app.server?.port}`
);
