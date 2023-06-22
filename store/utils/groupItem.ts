export function groupItem(group: string): string {
  switch (group) {
    case "armors":
      return "Броня";
    case "weapons":
      return "Оружие";
    case "artifacts":
      return "Артефакты";
    case "bullets":
      return "Патроны";
    case "usual":
      return "Предметы";
    case "medicines":
      return "Медикаменты";
    case "detectors":
      return "Детекторы";
    default:
      return group;
  }
}

export const groups = [
  ["LONERS", "Одиночки"],
  ["BANDITS", "Бандиты"],
  ["MILITARY", "Военные"],
  ["LIBERTY", "Свобода"],
  ["DUTY", "Долг"],
  ["MONOLITH", "Монолит"],
  ["MERCENARIES", "Наемники"],
  ["SCIENTISTS", "Ученые"],
  ["CLEARSKY", "Чистое небо"],
];

export const strength = [
  ["WEAK", "Слабый отряд"],
  ["MIDDLE", "Средний отряд"],
  ["STRONG", "Мощный отряд"],
];
