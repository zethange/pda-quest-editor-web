import { ChapterType } from "../type/chapter.type";
import { MapType } from "../type/map.type";
import { StoryType } from "../type/story.type";

export type Session = {
  id: string;
  login: string;
  session: any;
};

export type Story = StoryType & {
  chapters: ChapterType[];
  maps: MapType[];
  localId: string;
  owner: Session;
  editors: Session[];
};

export const sessions: Session[] = [];
export const stories: Story[] = [];
