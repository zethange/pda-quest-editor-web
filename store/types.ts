export type stageType = {
  id: number;
  type_stage: number;
  background_url: string;
  title: string;
  message: string;
  type_message: number;
  texts: [
    {
      text: string;
      condition: any;
    }
  ];
  transfers: [
    {
      text: string;
      stage_id: string;
      condition: any;
    }
  ];
  actions: any;
};

export function exampleChapter(id: string) {
  return {
    id: Number(id),
    stages: [
      {
        id: 0,
        type_stage: 0,
        background_url: "//",
        title: "Привет-с",
        message: "",
        type_message: 0,
        texts: [
          {
            text: "У тебя крутые яйца",
            condition: {},
          },
        ],
        transfers: [
          {
            text: "У тебя тоже",
            stage_id: "1",
            condition: {},
          },
        ],
        actions: {},
      },
    ],
  };
}

export function newStage(id: number) {
  return {
    id,
    type_stage: 0,
    background_url: "//",
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
  };
}
