import { Log } from "@/store/validator";
import { chapterType } from "@/store/types/types";
import { Dispatch, SetStateAction } from "react";

export class FindStageByText {
  private logs: Log[];
  constructor(private readonly setLogs: Dispatch<SetStateAction<Log[]>>) {
    this.logs = [];
  }

  private log(log: Log) {
    this.setLogs((prev) => [log, ...prev]);
  }

  public run(textStr: string, chapter: chapterType) {
    if (textStr === "") {
      return;
    }
    chapter.stages.forEach((stage) => {
      if (stage.texts) {
        stage.texts.forEach((text) => {
          if (text.text.toLowerCase().includes(textStr.toLowerCase())) {
            this.log({
              type: "success",
              message: `Обнаружено совпадение в тексте стадии ${
                stage.id
              }, текст: ${text.text.substring(0, 30)}...`,
              nodeId: String(stage.id),
            });
          }
        });
      }
    });
  }
}
