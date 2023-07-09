type commandsType = {
  title: string;
  commands: [string, string, "item" | "empty" | "null" | "codemirror"][];
};

export const commands: commandsType[] = [
  {
    title: "Операции с предметами",
    commands: [
      ["add", "Добавить", "item"],
      ["remove", "Удалить", "item"],
    ],
  },
  {
    title: "Операции с отношениями",
    commands: [
      ["+", "Увеличить отношения", "empty"],
      ["-", "Уменьшить отношения", "empty"],
    ],
  },
  {
    title: "Всё остальное",
    commands: [
      ["xp", "Добавить/удалить опыт", "empty"],
      ["money", "Добавить/удалить деньги", "empty"],
      ["note", "Заметка", "empty"],
      ["reset", "Сбросить", "empty"],
      ["syncNow", "Синхронизация с сервером", "null"],
      ["openStage", "Открыть стадию", "empty"],
      ["openSeller", "Открыть торговца", "empty"],
      ["exitStory", "Закрыть историю", "null"],
      ["finishStory", "Закончить историю", "null"],
      ["script", "Кастомный скрипт", "codemirror"],
    ],
  },
  {
    title: "Музыка",
    commands: [
      ["playMusic", "Проиграть музыку", "empty"],
      ["playSound", "Проиграть звук", "empty"],
      ["pauseSound", "Поставить звук на паузу...", "empty"],
      ["stopMusic", "Остановить музыку", "null"],
      ["loopMusic", "Зациклить музыку", "empty"],
      ["pauseAllSound", "Поставить все звуки на паузу", "null"],
      ["resumeAllSound", "Продолжить воспроизведение всех звуков", "null"],
    ],
  },
];

export function commandLocalize(param: string): string {
  let allCommands: string[][] = [];

  for (let i = 0; i < commands.length; i++) {
    allCommands.push(...commands[i].commands);
  }
  const requiredCommand = allCommands.find((command) => command[0] === param);

  return requiredCommand![1];
}

export function typeCommand(param: string) {
  let allCommands: string[][] = [];

  for (let i = 0; i < commands.length; i++) {
    allCommands.push(...commands[i].commands);
  }
  const requiredCommand = allCommands.find((command) => command[0] === param);
  return requiredCommand![2] as "item" | "empty" | "null" | "codemirror";
}
