import ActionsCard from "@/components/actionsCard";

export default function EditPopover({ stage }: { stage: any }) {
  let typeStage;
  if (stage?.type_stage === 0 || stage?.type_stage === 1) {
    typeStage = "диалог";
  } else if (stage?.type_stage === 4) {
    typeStage = "переход";
  }
  return (
    <div
      style={{
        position: "absolute",
        width: "400px",
        height: "calc(100vh - 78px)",
        right: "0",
        padding: "20px",
        background: "var(--white)",
        zIndex: "100",
      }}
    >
      <div style={{ fontSize: "20px", paddingBottom: "5px" }}>
        Стадия {stage?.id}
      </div>
      <div className="stage-card">Тип: {typeStage}</div>
      {typeStage === "диалог" && (
        <>
          <div className="stage-card">
            <img
              src={"https://files.artux.net/static/" + stage?.background_url}
              style={{ width: "340px", borderRadius: "5px" }}
              alt={stage?.title}
            />
          </div>
          {stage.message && (
            <div className="stage-card" style={{ fontSize: "12px" }}>
              <div>Тип сообщения: {stage?.type_message}</div>
              <div>{stage?.message}</div>
            </div>
          )}
          <div className="stage-card" style={{ fontSize: "12px" }}>
            <b>Тексты:</b>
            {stage?.texts?.map((text: any) => (
              <div key={text.text}>{text.text}</div>
            ))}
          </div>
          <div className="stage-card" style={{ fontSize: "12px" }}>
            <b>Переходы:</b>
            {stage?.transfers?.map((transfer: any) => (
              <div key={transfer?.text}>
                {`- "${transfer?.text}", переход на стадию ${transfer?.stage_id}`}
              </div>
            ))}
          </div>
        </>
      )}
      <ActionsCard actions={stage?.actions} />
    </div>
  );
}
