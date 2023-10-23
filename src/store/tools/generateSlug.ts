function transliterate(text: string) {
  const cyrillicToLatinMap = {
    а: "a",
    б: "b",
    в: "v",
    г: "g",
    д: "d",
    е: "e",
    ё: "yo",
    ж: "zh",
    з: "z",
    и: "i",
    й: "y",
    к: "k",
    л: "l",
    м: "m",
    н: "n",
    о: "o",
    п: "p",
    р: "r",
    с: "s",
    т: "t",
    у: "u",
    ф: "f",
    х: "h",
    ц: "ts",
    ч: "ch",
    ш: "sh",
    щ: "shch",
    ъ: "",
    ы: "y",
    ь: "",
    э: "e",
    ю: "yu",
    я: "ya",
  };

  return text.replace(/[а-яё]/g, function (match) {
    const lowercaseChar = match.toLowerCase();
    const transliteratedChar =
      // @ts-ignore
      cyrillicToLatinMap[lowercaseChar] || lowercaseChar;
    return match === lowercaseChar
      ? transliteratedChar
      : transliteratedChar.toUpperCase();
  });
}

export function generateSlug(text: string) {
  const transliterated = transliterate(text.toLowerCase())
    .replace(/[^\w-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  // Кодируем специальные символы
  return encodeURIComponent(transliterated);
}
