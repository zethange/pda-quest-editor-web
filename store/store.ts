import { stageTransfer } from "@/store/types/types";

export let storeStage: any = {};

// Создание стадии
export function setStageToStore(stage: any) {
  storeStage = {};
  storeStage = stage;
  console.log("Обновление стадии в сторе", storeStage);
}

// Новый текст в стадию
export function newTextToStore() {
  storeStage.texts.push({ text: "Новый текст", condition: {} });
}

// Новый переход в стадию
export function newTransferToStore(transfer: stageTransfer) {
  if (
    !storeStage.transfers.find(
      (findTransfer: any) => findTransfer.stage === transfer.stage
    )
  ) {
    storeStage.transfers.push(transfer);
    return storeStage.transfers.indexOf(transfer);
  } else {
    const index = storeStage.transfers.indexOf(
      storeStage.transfers.find(
        (findTransfer: any) => findTransfer.stage === transfer.stage
      )
    );
    storeStage.transfers.splice(index, 1, transfer);
    return storeStage.transfers.indexOf(transfer);
  }
}

// Удаление условия в переходе
export default function deleteConditionInTransfer(
  transferIndex: number,
  conditionIndex: number
) {
  const conditions: any = Object.entries(
    storeStage.transfers[transferIndex].condition
  );
  conditions.splice(conditionIndex, 1);

  storeStage.transfers[transferIndex].condition =
    Object.fromEntries(conditions);
}

// Создание условия в переходе
export function createConditionsInTransfer(
  transferIndex: number,
  typeCondition: string
) {
  console.log(storeStage.transfers, transferIndex);
  switch (typeCondition) {
    case "has":
      storeStage.transfers[transferIndex].condition = {
        ...storeStage.transfers[transferIndex].condition,
        has: ["параметр"],
      };
    case "!has":
      storeStage.transfers[transferIndex].condition = {
        ...storeStage.transfers[transferIndex].condition,
        "!has": ["параметр"],
      };
    case "money>=":
      storeStage.transfers[transferIndex].condition = {
        ...storeStage.transfers[transferIndex].condition,
        "money>=": ["100"],
      };
  }
}

// Создание параметра в условии
export function createValueInCondition(
  transferIndex: number,
  conditionIndex: number
) {
  const conditions: any = Object.entries(
    storeStage.transfers[transferIndex].condition
  );
  conditions[conditionIndex][1].push("новый_параметр");
}

// Редактирование параметра в условии
export function editValueInConditions(
  transferIndex: number,
  conditionIndex: number,
  valueIndex: number,
  value: string
) {
  const conditions: any = Object.entries(
    storeStage.transfers[transferIndex].condition
  );
  conditions[conditionIndex][1][valueIndex] = value;
}

// Удаление параметра в условии
export function deleteValueInCondition(
  transferIndex: number,
  conditionIndex: number,
  valueIndex: number
) {
  const conditions: any = Object.entries(
    storeStage.transfers[transferIndex].condition
  );
  conditions[conditionIndex][1].splice(valueIndex, 1);
}

export function editTitleInStore(title: string) {
  storeStage.title = title;
}

export function editBackgroundInStore(background_url: string) {
  storeStage.background = background_url;
}

export function editMessageInStore(message: string) {
  storeStage.message = message;
}

export function editTextInStore(id: number, text: any) {
  storeStage.texts.splice(id, 1, text);
  console.log("Изменение текста в сторе", storeStage.texts);
}

export function editTransferInStore(id: number, transfer: any) {
  storeStage.transfers.splice(id, 1, transfer);
  console.log("Изменение перехода в сторе", storeStage.transfers);
}

export function deleteMethodInAction(indexMethod: number): void {
  const arrayActions: any = Object.entries(storeStage.actions);
  arrayActions.splice(indexMethod, 1);
  storeStage.actions = Object.fromEntries(arrayActions);
}

export function editParamInAction(
  editedParam: string,
  indexMethod: number,
  indexParam: number
) {
  const arrayActions: any = Object.entries(storeStage.actions);
  arrayActions[indexMethod][1][indexParam] = editedParam;
  storeStage.actions = Object.fromEntries(arrayActions);
  console.log("Изменение параметра в action", storeStage.actions);
}

export function deleteParamInAction(indexMethod: number, indexParam: number) {
  const arrayActions: any = Object.entries(storeStage.actions);
  arrayActions[indexMethod][1].splice(indexParam, 1);
  storeStage.actions = Object.fromEntries(arrayActions);
}

export function newParamInAction(indexMethod: number, param: string) {
  const arrayActions: any = Object.entries(storeStage.actions);
  arrayActions[indexMethod][1].push(param);
  storeStage.actions = Object.fromEntries(arrayActions);
  console.log("Новый параметр в action", storeStage);
}

export function newMethodInAction(typeMethod: string = "add") {
  const arrayActions: any = Object.entries(storeStage.actions);
  arrayActions.push([typeMethod, []]);
  storeStage.actions = Object.fromEntries(arrayActions);
  console.log("Новый метод в action", storeStage);
}
