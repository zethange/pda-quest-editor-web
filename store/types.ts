export function newChapter(id: string) {
  return {
    id: Number(id),
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
