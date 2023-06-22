export function conditionType(condition: string) {
  switch (condition) {
    case "has":
      return "Если есть параметр(ы):";
    case "!has":
      return "Если нет параметра(ов):";
    case "money>=":
      return "Если денег больше или равно:";
  }
}
