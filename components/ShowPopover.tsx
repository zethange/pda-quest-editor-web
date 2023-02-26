import ActionsCard from "@/components/actionsCard";
import Image from "next/image";
import MapStage from "@/components/popover/MapStage";

export default function ShowPopover({ stage }: { stage: any }) {
  let typeStage;
  if (
    stage?.type_stage === 0 ||
    stage?.type_stage === 1 ||
    stage?.type_stage === 7
  ) {
    typeStage = "диалог";
  } else if (stage?.type_stage === 4 || stage?.type_stage === 5) {
    typeStage = "переход";
  }

  return (
    <>
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
            <ul>
              {stage?.texts?.map((text: any) => (
                <>{text.text !== "" && <li key={text.text}>{text.text}</li>}</>
              ))}
            </ul>
          </div>
          <div className="stage-card" style={{ fontSize: "12px" }}>
            <b>Переходы:</b>
            <ul>
              {stage?.transfers?.map((transfer: any) => (
                <li key={transfer?.text}>
                  {`"${transfer?.text}", переход на стадию ${transfer?.stage_id}`}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
      {typeStage === "переход" && <MapStage data={stage.data} />}
      <ActionsCard actions={stage?.actions} />
    </>
  );
}