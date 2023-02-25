export default function ActionsCard({ actions }: { actions: any }) {
  if (actions && Object.keys(actions).length) {
    const arrRelation: string[] = [];
    actions["-"]?.map((key: string) => {
      const group: string[] = key.split(":");
      if (group[0] === "relation_0") {
        arrRelation.push(`репутацию у Одиночек, на ${group[1]}`);
      } else if (group[0] === "relation_1") {
        arrRelation.push(`репутацию у Бандитов, на ${group[1]}`);
      } else if (group[0] === "relation_2") {
        arrRelation.push(`репутацию у Военных, на ${group[1]}`);
      } else if (group[0] === "relation_3") {
        arrRelation.push(`репутацию у Свободы, на ${group[1]}`);
      } else if (group[0] === "relation_4") {
        arrRelation.push(`репутацию у Долга, на ${group[1]}`);
      } else if (group[0] === "relation_5") {
        arrRelation.push(`репутацию у Монолита, на ${group[1]}`);
      } else if (group[0] === "relation_6") {
        arrRelation.push(`репутацию у Наёмников, на ${group[1]}`);
      } else if (group[0] === "relation_7") {
        arrRelation.push(`репутацию у Учёных, на ${group[1]}`);
      } else if (group[0] === "relation_8") {
        arrRelation.push(`репутацию у Чистого Нёба, на ${group[1]}`);
      }
    });

    return (
      <div className="stage-card" style={{ fontSize: "12px" }}>
        <b>Действия:</b>
        {actions?.add && <p>Добавить: {actions?.add[0]}</p>}
        {actions?.remove && <p>Удалить: {actions?.remove[0]}</p>}
        {actions?.xp && <p>Опыт: {actions?.xp[0]}</p>}
        {actions?.money && <p>Добавить денег: {actions?.money[0]} руб.</p>}
        {actions["-"] && (
          <p>
            Уменьшить:{" "}
            {arrRelation?.map((key: string) => (
              <span key={key}>{key + "; "}</span>
            ))}
          </p>
        )}
      </div>
    );
  } else {
    return null;
  }
}
