export function imagePoint(type: string) {
  switch (type) {
    case "0":
      return "quest.png";
    case "1":
      return "quest.png";
    case "2":
      return "quest.png";
    case "3":
      return "quest.png";
    case "4":
      return "seller.png";
    case "5":
      return "cache.png";
    case "6":
      return "quest1.png";
    case "7":
      return "transfer.png";
  }
}

export function translateTypePoint(type: string) {
  switch (type) {
    case "0":
      return "Квест (0)";
    case "1":
      return "Квест (1)";
    case "2":
      return "Квест (2)";
    case "3":
      return "Квест (3)";
    case "4":
      return "Торговец";
    case "5":
      return "Тайник";
    case "6":
      return "Дополнительный квест";
    case "7":
      return "Переход";
  }
}
