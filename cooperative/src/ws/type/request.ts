import { ChapterType } from "../../type/chapter.type";
import { StoryType } from "../../type/story.type";

export interface IMessage {
  type:
    | "LOGIN"
    | "SHARE_STORY"
    | "CLOSE_STORY"
    | "REQUEST_ACCESS"
    | "GET_SHARED_STORIES"
    | "ANSWER_REQUEST";
  id: string;
  login?: {
    login: string;
  };
  shareStory?: {
    story: StoryType;
    chapters: ChapterType[];
  };
  closeStory?: {
    id: string;
  };
  requestAccess?: {
    storyId: string;
  };
  answerRequest?: {
    id: string;
    allow: boolean;
  };
}
