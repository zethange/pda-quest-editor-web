export const commands = [
  ["add", "Добавить"],
  ["remove", "Удалить"],
  ["xp", "Добавить/удалить опыт"],
  ["money", "Добавить/удалить деньги"],
  ["+", "Увеличить отношения"],
  ["-", "Уменьшить отношения"],
  ["note", "Заметка"],
  ["reset", "Сбросить"],
  ["syncNow", "Синхронизация с сервером"],
  ["openStage", "Открыть стадию"],
  ["openSeller", "Открыть торговца"],
  ["exitStory", "Закрыть историю"],
  ["finishStory", "Закончить историю"],
  ["script", "Кастомный скрипт"],
];

export function commandLocalize(param: string): string {
  switch (param) {
    case "add":
      return "Добавить";
    case "remove":
      return "Удалить";
    case "xp":
      return "Добавить/удалить опыт";
    case "money":
      return "Добавить/удалить деньги";
    case "+":
      return "Увеличить отношения";
    case "-":
      return "Уменьшить отношения";
    case "reset":
      return "Сбросить";
    case "note":
      return "Заметка";
    case "syncNow":
      return "Синхронизация с сервером";
    case "openStage":
      return "Открыть стадию";
    case "openSeller":
      return "Открыть торговца";
    case "exitStory":
      return "Закрыть историю";
    case "finishStory":
      return "Закончить историю";
    case "script":
      return "Скриптовуха";
    default:
      return param;
  }
}

export function typeCommand(
  param: string
): "item" | "empty" | "null" | "codemirror" {
  switch (param) {
    case "add":
      return "item";
    case "remove":
      return "item";
    case "xp":
      return "empty";
    case "money":
      return "empty";
    case "+":
      return "empty";
    case "-":
      return "empty";
    case "note":
      return "empty";
    case "reset":
      return "empty";
    case "syncNow":
      return "null";
    case "openStage":
      return "empty";
    case "openSeller":
      return "empty";
    case "exitStory":
      return "null";
    case "finishStory":
      return "null";
    case "script":
      return "codemirror";
    default:
      return "empty";
  }
}
