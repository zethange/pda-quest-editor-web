import { COOPERATIVE_URL } from "../config";

const login = async (login: string) => {
  const res = await fetch("http://" + COOPERATIVE_URL + "/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      login,
    }),
  });

  return (await res.json()) as {
    ok: boolean;
    msg: string;
    userId: string;
  };
};

const shareStory = async (story: any, userId: string) => {
  const res = await fetch(
    "http://" + COOPERATIVE_URL + `/api/story/share?userId=${userId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(story),
    }
  );

  return (await res.json()) as {
    ok: boolean;
    msg: string;
    storyId: string;
  };
};

export { shareStory, login };
