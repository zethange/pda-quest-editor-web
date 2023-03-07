import { findRelation } from "@/store/utils/relation";

export default function ActionsCard({ actions }: { actions: any }) {
  if (actions && Object.keys(actions).length) {
    if (actions?.remove?.join(", ").indexOf(":") > -1) {
      // console.log("есть предмет(ы)");
    }

    return (
      <div className="stage-card" style={{ fontSize: "12px" }}>
        <b>Действия:</b>
        {actions?.add && <p>Добавить: {actions?.add?.join(", ")}</p>}
        {actions?.remove && <p>Удалить: {actions?.remove?.join(", ")}</p>}
        {actions?.xp && <p>Опыт: {actions?.xp?.join(", ")}</p>}
        {actions?.money && <p>Деньги: {actions?.money?.join(", ")} руб.</p>}
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
