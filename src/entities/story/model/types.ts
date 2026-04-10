export type Story = {
  id: number;
  title: string;
  desc: string;
  icon: string;
  access: string;
};

export interface StoryAuthor {
  id: string;
  login: string;
  name: string;
  nickname: string;
  avatar: string;
  pdaId: number;
  xp: number;
  achievements: number;
  gang: string;
  registration: string;
  lastLoginAt: string;
}

export interface StoryFromServer {
  storageId: string;
  storyId: number;
  title: string;
  icon: string;
  needs: number[];
  access: string;
  message: string;
  archive: boolean;
  type: string;
  timestamp: string;
  author: StoryAuthor;
  hashcode: number;
}
