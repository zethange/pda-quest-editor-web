import { Story } from "../../database";

export const toStoryType = (s: Story) => ({
  id: s.id,
  title: s.title,
  desc: s.desc,
  owner: s.owner.login,
});
