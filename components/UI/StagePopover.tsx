import { stageType } from "@/store/types";

type Props = {
  stage: stageType;
};

export default function StagePopover({ stage }: Props) {
  return (
    <div
      style={{
        display: "block",
        position: "absolute",
        right: "0",
        height: "calc(100vh - 78px)",
        width: "400px",
        zIndex: "1000",
        padding: "20px",
        background: "var(--white)",
        border: "1px solid var(--light-gray)",
      }}
    >
      <h4>Редактор стадии {stage.id}</h4>
      <div>
        <div>{stage.message}</div>
        <input />
        <textarea
          style={{ width: "360px" }}
          placeholder="Введите текст"
        ></textarea>
      </div>
    </div>
  );
}
