export let storeStage: any = {};

// Создание стадии
export function setStageToStore(stage: any) {
  storeStage = stage;
}

// Новый текст в стадию
export function newTextToStore() {
  storeStage?.texts?.push({ text: "Это новый текст", condition: {} });
}

// Новый переход в стадию
export function newTransferToStore() {
  storeStage?.transfers?.push({
    text: "Это новый переход",
    stage_id: 0,
    condition: {},
  });
}

export function editTextInStore(id: number, text: any) {
  storeStage.texts.splice(id, 1, text);
  console.log(storeStage.texts);
}

export function editTransferInStore(id: number, transfer: any) {
  storeStage.transfers.splice(id, 1, transfer);
  console.log(storeStage.transfers);
}
