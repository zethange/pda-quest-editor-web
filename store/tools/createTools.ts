export function newChapter(id: string) {
  return {
    id: Number(id),
    stages: [
      {
        id: 0,
        type_stage: 0,
        background: "",
        title: "",
        message: "",
        type_message: 0,
        texts: [
          {
            text: "",
            condition: {},
          },
        ],
        transfers: [],
        actions: {},
        editor: {
          x: 0,
          y: 0,
        },
      },
    ],
    points: {},
    spawns: {},
    mission: [],
  };
}

interface IPosition {
  x: number;
  y: number;
}

export function newStage(
  type: "default" | "exit" | "chapterEnd",
  id: number,
  customPosition: boolean = false,
  data?: IPosition
) {
  const position = customPosition
    ? data
    : { x: Math.random() * 500, y: Math.random() * 500 };
  if (type === "default") {
    return {
      id,
      type_stage: 0,
      background: "",
      title: "",
      message: "",
      type_message: 0,
      texts: [
        {
          text: "",
          condition: {},
        },
      ],
      transfers: [],
      actions: {},
      editor: position,
    };
  } else if (type === "exit") {
    return {
      id,
      type_stage: 4,
      data: { map: "0", pos: "235:235" },
      editor: position,
    };
  } else if (type === "chapterEnd") {
    return {
      id,
      type_stage: 5,
      actions: {},
      transfers: [],
      editor: position,
    };
  }
}
