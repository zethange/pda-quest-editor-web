export function stageName(type_stage: number) {
  // legacy черт возьми
  switch (type_stage) {
    case 0:
      return false;
    case 1:
      return false;
    case 2:
      return false;
    case 3:
      return false;
    case 4:
      return "Переход на карту";
    case 5:
      return "Конец главы";
    case 6:
      return "Продавец";
    case 7:
      return false;
    default:
      return false;
  }
}

export function stageTypes(type_stage: number) {
  switch (type_stage) {
    case 0:
      return "default";
    case 1:
      return "default";
    case 2:
      return "default";
    case 3:
      return "default";
    case 4:
      return "map";
    case 5:
      return "chapterEnd";
    case 6:
      return "seller";
    case 7:
      return "default";
    default:
      return "default";
  }
}