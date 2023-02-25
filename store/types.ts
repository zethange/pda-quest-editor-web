export function newChapter(id: string) {
  return {
    id: Number(id),
    music: [
      {
        id: "0",
        name: "Fire 1 20% | Prologue chapter 0",
        url: "https://pda.artux.net/story/prologue/sound/fire.mp3",
        params: ["loop", "volume:0.2"],
      },
      {
        id: "1",
        name: "Fire 1 50%| Prologue chapter 0",
        url: "https://pda.artux.net/story/prologue/sound/fire.mp3",
        params: ["loop", "volume:0.5"],
      },
      {
        id: "2",
        name: "Guitar 1 50% | Prologue chapter 0",
        url: "https://pda.artux.net/story/prologue/sound/guitar.mp3",
        params: ["volume:0.5"],
      },
      {
        id: "3",
        name: "Guitar 1 100% | Prologue chapter 0",
        url: "https://pda.artux.net/story/prologue/sound/guitar.mp3",
        params: [],
      },
      {
        id: "4",
        name: "PDA новое уведомление",
        url: "https://pda.artux.net/story/prologue/sound/PDA1.mp3",
        params: [],
      },
      {
        id: "5",
        name: "PDA новый квест",
        url: "https://pda.artux.net/story/prologue/sound/PDA2.mp3",
        params: [],
      },
      {
        id: "6",
        name: "PDA новое сообщение",
        url: "https://pda.artux.net/story/prologue/sound/PDA3.mp3",
        params: [],
      },
    ],
    stages: [
      {
        id: 0,
        type_stage: 0,
        background_url: "",
        title: "Это начало великой истории",
        message: "",
        type_message: 0,
        texts: [
          {
            text: "Go to the gym",
            condition: {},
          },
        ],
        transfers: [
          {
            text: "Пошли",
            stage_id: "1",
            condition: {},
          },
        ],
        actions: {},
        editor: {
          x: 0,
          y: 0,
        },
      },
    ],
  };
}

export function newStage(type: string, id: number) {
  if (type === "default") {
    return {
      id,
      type_stage: 0,
      background_url: "",
      title: "Новая стадия",
      message: "",
      type_message: 0,
      texts: [
        {
          text: "Привет.",
          condition: {},
        },
      ],
      transfers: [
        {
          text: "Привет. Как дела?",
          stage_id: String(id + 1),
          condition: {},
        },
      ],
      actions: {},
      editor: { x: Math.random() * 500, y: Math.random() * 500 },
    };
  } else if (type === "exit") {
    return {
      id,
      type_stage: 4,
      data: { map: 0, pos: "4:2" },
      editor: { x: Math.random() * 500, y: Math.random() * 500 },
    };
  }
}
