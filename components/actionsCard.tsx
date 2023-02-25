import { findRelation } from "@/store/utils/relation";

export default function ActionsCard({ actions }: { actions: any }) {
  if (actions && Object.keys(actions).length) {
    return (
      <div className="stage-card" style={{ fontSize: "12px" }}>
        <b>Действия:</b>
        {actions?.add && <p>Добавить: {actions?.add[0]}</p>}
        {actions?.remove && <p>Удалить: {actions?.remove[0]}</p>}
        {actions?.xp && <p>Опыт: {actions?.xp[0]}</p>}
        {actions?.money && <p>Деньги: {actions?.money[0]} руб.</p>}
        {actions["-"] && (
          <p>
            Уменьшить{" "}
            {findRelation(actions["-"])?.map((key: string) => (
              <span key={key}>{"репутацию " + key + "; "}</span>
            ))}
          </p>
        )}
        {actions?.reset && (
          <p>
            Сбросить{" "}
            {actions.reset.length > 0 &&
              findRelation(actions.reset)?.map((key: string) => (
                <span key={key}>{"репутацию " + key + "; "}</span>
              ))}
            {actions.reset.length === 0 && <span>всё снаряжение</span>}
          </p>
        )}
      </div>
    );
  } else {
    return null;
  }
}
