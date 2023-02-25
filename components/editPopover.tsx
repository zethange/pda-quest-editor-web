import ActionsCard from "@/components/actionsCard";
import Image from "next/image";
import MapStage from "@/components/popover/MapStage";

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
            <p style={{ paddingBottom: "5px" }}>{stage?.title}</p>
            <img
              src={
                stage?.background_url
                  ? "https://files.artux.net/static/" + stage?.background_url
                  : "/no_background.jpg"
              }
              style={{ borderRadius: "5px", width: "340px" }}
              alt={stage?.title}
            />
          </div>
          {stage.message && (
            <div className="stage-card" style={{ fontSize: "12px" }}>
              <div>{stage?.message}</div>
            </div>
          )}
          <div className="stage-card" style={{ fontSize: "12px" }}>
            <b>Тексты:</b>
            {stage?.texts?.map((text: any) => (
              <ul key={text.text}>
                <li>{text.text}</li>
              </ul>
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
      {typeStage === "переход" && <MapStage data={stage.data} />}
      <ActionsCard actions={stage?.actions} />
    </div>
  );
}
