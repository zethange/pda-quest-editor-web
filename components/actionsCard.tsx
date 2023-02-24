export default function ActionsCard({ actions }: { actions: any }) {
  if (actions && Object.keys(actions).length) {
    return (
      <div className="stage-card" style={{ fontSize: "12px" }}>
        <b>Действия:</b>
        {actions?.add && <p>Добавить: {actions?.add[0]}</p>}
        {actions?.remove && <p>Удалить: {actions?.remove[0]}</p>}
        {actions?.xp && <p>Добавить опыт: {actions?.xp[0]}</p>}
        {actions?.money && <p>Добавить денег: {actions?.money[0]} руб.</p>}
      </div>
    );
  } else {
    return <div></div>;
  }
}
