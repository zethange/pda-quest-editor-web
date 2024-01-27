import { StoryType } from "../../type/story.type";

interface IDefaultResponse {
  ok: boolean;
  data?: string;
}

export interface IResponse {
  type:
    | "CONNECT"
    | "ERROR"
    | "LOGIN"
    | "SHARE_STORY"
    | "CLOSE_STORY"
    | "REQUEST_ACCESS"
    | "REQUEST_SHARE_STORY"
    | "SHARED_STORIES";
  connect?: {
    id: string;
  };
  error?: {
    data: string;
  };
  login?: IDefaultResponse;
  shareStory?: IDefaultResponse & {
    id?: string;
  };
  closeStory?: IDefaultResponse & {
    id?: string;
  };
  requestAccess?: IDefaultResponse & {};
  requestShareStory?: IDefaultResponse & {
    storyId: string;
    userLogin: string;
  };
  sharedStories?: {
    id: string;
    story: StoryType;
    owner: {
      login: string;
    };
  }[];
}
