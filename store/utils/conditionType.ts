export function conditionType(condition: string) {
  switch (condition) {
    case "has":
      return "Если есть параметра:";
    case "!has":
      return "Если нет параметра:";
    case "money>=":
      return "Если денег больше или равно:";
  }
}
