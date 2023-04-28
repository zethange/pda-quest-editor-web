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
