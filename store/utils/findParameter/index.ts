import { chapterType } from "@/store/types/types";
import { Log } from "@/store/validator";

export class FindParameter {
  private logs: Log[];
  constructor(
    private readonly chapter: chapterType,
    private readonly parameter: string,
    private readonly setLogs: (logs: Log[]) => void
  ) {
    this.logs = [];
  }

  public search() {
    this.chapter.stages.forEach((stage) => {
      // проверка на добавления параметра
      if (
        stage.actions &&
        stage.actions.add &&
        stage.actions.add.includes(this.parameter)
      ) {
        this.logs.push({
          type: "success",
          message: "Добавление параметра в стадии " + stage.id,
          nodeId: String(stage.id),
        });
      }

      // проверка на чек параметра в тексте
      if (stage.texts) {
        stage.texts.forEach((text, index) => {
          if (
            text.condition &&
            Object.values(text.condition).flat().includes(this.parameter)
          ) {
            this.logs.push({
              type: "warning",
              message: `Проверка параметра в тексте ${index} стадии ${stage.id}`,
              nodeId: String(stage.id),
            });
          }
        });
      }

      // проверка на чек параметра в тексте
      if (stage.transfers) {
        stage.transfers.forEach((transfer) => {
          if (
            transfer.condition &&
            Object.values(transfer.condition).flat().includes(this.parameter)
          ) {
            this.logs.push({
              type: "warning",
              message: `Проверка параметра в переходе со стадии ${stage.id} на ${transfer.stage}`,
              nodeId: String(stage.id),
            });
          }
        });
      }
    });

    if (this.chapter.points) {
      Object.values(this.chapter.points)
        .flat()
        .forEach((point) => {
          if (
            point.condition &&
            Object.values(point.condition).flat().includes(this.parameter)
          ) {
            this.logs.push({
              type: "warning",
              message: `Проверка параметра в переходе с карты на стадию ${point.data.stage}`,
              nodeId: String(point.id),
            });
          }
        });
    }

    this.setLogs(this.logs);
  }
}
