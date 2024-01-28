import { ServerWebSocket } from "bun";
import { IUserOnline, stories, users } from "..";
import { IMessage } from "../type/request";
import { IResponse } from "../type/response";

export const enterStory = (
  message: IMessage,
  ws: ServerWebSocket<unknown>
): IResponse => {
  const { id } = message;
  const user = users.find((user) => user.id === id);

  const story = stories.find(
    (story) => message.enterStory?.storyId === story.id
  );

  if (story?.editors.some((editor) => editor.id === id)) {
    story.editorsOnline.push(user as IUserOnline);
  }

  story?.editors.forEach((editor) => {
    editor.session.send(
      JSON.stringify({
        type: "UPDATE_EDITORS_ONLINE",
        updateEditorsOnline: {
          editorsOnline: story.editorsOnline.map((editor) => ({
            login: editor.login,
            id: editor.id,
          })),
        },
      } as IResponse)
    );
  });

  return {
    type: "NULL",
  };
};

const exitStory = (
  message: IMessage,
  ws: ServerWebSocket<unknown>
): IResponse => {
  const { id } = message;

  const story = stories.find(
    (story) => message.exitStory?.storyId === story.id
  );

  if (story?.editorsOnline.some((editor) => editor.id === id)) {
    story.editorsOnline = story.editorsOnline.filter(
      (editor) => editor.id !== id
    );
  }

  story?.editors.forEach((editor) => {
    editor.session.send(
      JSON.stringify({
        type: "UPDATE_EDITORS_ONLINE",
        updateEditorsOnline: {
          editorsOnline: story.editorsOnline.map((editor) => ({
            login: editor.login,
            id: editor.id,
          })),
        },
      } as IResponse)
    );
  });

  return {
    type: "NULL",
  };
};
