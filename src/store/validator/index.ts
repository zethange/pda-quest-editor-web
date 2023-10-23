import { chapterType } from "@/store/types/story/chapterType";
import { Dispatch, SetStateAction } from "react";

export type Log = {
  type: "warning" | "error" | "info" | "success";
  message: string;
  nodeId: string;
};

export class Validator {
  private transfers: string[];
  private stages: string[];

  constructor(
    private readonly chapter: chapterType,
    private setLogs: Dispatch<SetStateAction<Log[]>>
  ) {
    this.transfers = [];
    this.stages = [];
  }

  private log(log: Log) {
    this.setLogs((prev) => [log, ...prev]);
  }

  private validateStages() {
    this.chapter.stages.forEach((stage) => {
      stage.texts?.forEach((text) => {
        if (stage.texts?.length! === 1 && !text.text) {
          this.log({
            type: "error",
            message: `В стадии ${stage.id} обнаружен текст без текста -.-`,
            nodeId: String(stage.id),
          });
        }
        let last = text.text.charAt(text.text.length - 1);
        // @ts-ignore
        if (last !== "." && last !== "?" && last !== "!") {
          this.log({
            type: "info",
            message: `Текст в стадии ${stage.id} не заканчивается знаком препинания`,
            nodeId: String(stage.id),
          });
        }
      });
      if (stage.transfers && !stage.transfers.length) {
        this.log({
          type: "error",
          message: `В стадии ${stage.id} не обнаружено переходов`,
          nodeId: String(stage.id),
        });
      }

      stage.transfers?.forEach((transfer) => {
        let last = transfer.text.charAt(transfer.text.length - 1);
        if (last === ".") {
          this.log({
            type: "info",
            message: `Переход в стадии ${stage.id} заканчивается знаком препинания`,
            nodeId: String(stage.id),
          });
        }
      });

      if (
        this.stages.findIndex((st) => String(st) === String(stage.id)) === -1
      ) {
        this.stages.push(String(stage.id));
      } else {
        this.log({
          type: "error",
          message: `Обнаружен дупликат стадии с ID: ${stage.id}`,
          nodeId: String(stage.id),
        });
      }

      stage.transfers?.forEach((transfer) => {
        const edgeId = `${stage.id}:${transfer.stage}`;
        if (this.transfers.findIndex((tr) => tr === edgeId) === -1) {
          this.transfers.push(edgeId);
        } else {
          this.log({
            type: "warning",
            message: `Обнаружен дупликат перехода из ${stage.id} стадии в ${transfer.stage}`,
            nodeId: String(stage.id),
          });
        }
      });
    });
  }

  public run() {
    this.validateStages();
  }
}
