export const findRelation = (key: any): any => {
  const arrRelation: string[] = [];

  key?.map((key: string) => {
    const group: string[] = key.split(":");
    let number = "";
    if (group[1] !== undefined) {
      number = `, на ${group[1]}`;
    }

    if (group[0] === "relation_0") {
      arrRelation.push(`у Одиночек${number}`);
    } else if (group[0] === "relation_1") {
      arrRelation.push(`у Бандитов${number}`);
    } else if (group[0] === "relation_2") {
      arrRelation.push(`у Военных${number}`);
    } else if (group[0] === "relation_3") {
      arrRelation.push(`у Свободы${number}`);
    } else if (group[0] === "relation_4") {
      arrRelation.push(`у Долга${number}`);
    } else if (group[0] === "relation_5") {
      arrRelation.push(`у Монолита${number}`);
    } else if (group[0] === "relation_6") {
      arrRelation.push(`у Наёмников${number}`);
    } else if (group[0] === "relation_7") {
      arrRelation.push(`у Учёных${number}`);
    } else if (group[0] === "relation_8") {
      arrRelation.push(`у Чистого Нёба${number}`);
    }
  });

  return arrRelation;
};
