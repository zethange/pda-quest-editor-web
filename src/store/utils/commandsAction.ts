export type commandsLetterType =
  | "item"
  | "empty"
  | "null"
  | "codemirror"
  | "relation"
  | "notification";

type commandsType = {
  title: string;
  commands: [
    // command
    string,
    // перевод
    string,
    // тип
    commandsLetterType,
    // начальное значение
    string?
  ][];
};

export const commands: commandsType[] = [
  {
    title: "Операции с предметами",
    commands: [
      ["add", "Добавить", "item", "parameter"],
      ["remove", "Удалить", "item", "parameter"],
    ],
  },
  {
    title: "Операции с отношениями",
    commands: [
      ["+", "Увеличить отношения", "relation", "relation_0:1"],
      ["-", "Уменьшить отношения", "relation", "relation_0:1"],
    ],
  },
  {
    title: "Всё остальное",
    commands: [
      ["xp", "Добавить/удалить опыт", "empty", "-1"],
      ["money", "Добавить/удалить деньги", "empty", "-500"],
      ["openNotification", "Показать уведомление", "empty"],
      ["note", "Заметка", "empty", "Название:Содержимое"],
      ["reset", "Сбросить", "empty", "relation_0"],
      ["syncNow", "Синхронизация с сервером", "null"],
      ["openStage", "Открыть стадию", "empty"],
      ["openSeller", "Открыть торговца", "empty", "1"],
      ["exitStory", "Закрыть историю", "null"],
      ["finishStory", "Закончить историю", "null"],
      ["script", "Кастомный скрипт", "codemirror", 'print("LUA IS AWESOME")'],
    ],
  },
  {
    title: "Музыка",
    commands: [
      ["playMusic", "Проиграть музыку", "empty", "link"],
      ["playSound", "Проиграть звук", "empty", "link"],
      ["pauseSound", "Поставить звук на паузу...", "empty"],
      ["stopMusic", "Остановить музыку", "null"],
      ["loopMusic", "Зациклить музыку", "empty"],
      ["pauseAllSound", "Поставить все звуки на паузу", "null"],
      ["resumeAllSound", "Продолжить воспроизведение всех звуков", "null"],
    ],
  },
];

export function commandLocalize(param: string): string {
  let allCommands: [string, string, commandsLetterType, string?][] = [];

  commands.forEach((item) => {
    allCommands.push(...item.commands);
  });
  const requiredCommand = allCommands.find((command) => command[0] === param);

  if (requiredCommand) {
    return requiredCommand![1];
  } else {
    return param;
  }
}

export function typeCommand(param: string) {
  let allCommands: [string, string, commandsLetterType, string?][] = [];

  commands.forEach((item) => {
    allCommands.push(...item.commands);
  });
  const requiredCommand = allCommands.find((command) => command[0] === param);
  if (requiredCommand) {
    return requiredCommand![2] as commandsLetterType;
  } else {
    return "empty";
  }
}

export function getCommandById(id: string) {
  let allCommands: [string, string, commandsLetterType, string?][] = [];

  commands.forEach((item) => {
    allCommands.push(...item.commands);
  });
  return allCommands.find((command) => command[0] === id);
}
