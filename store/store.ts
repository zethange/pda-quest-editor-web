export let storeStage: any = {};

// Создание стадии
export function setStageToStore(stage: any) {
  storeStage = stage;
  console.log("Обновление стадии в сторе", storeStage);
}

// Новый текст в стадию
export function newTextToStore() {
  storeStage.texts.push({ text: "Это новый текст", condition: {} });
}

// Новый переход в стадию
export function newTransferToStore(transfer: any) {
  if (
    !storeStage.transfers.find(
      (findTransfer: any) => findTransfer.stage_id === transfer.stage_id
    )
  ) {
    storeStage.transfers.push(transfer);
  } else {
    const index = storeStage.transfers.indexOf(
      storeStage.transfers.find(
        (findTransfer: any) => findTransfer.stage_id === transfer.stage_id
      )
    );
    storeStage.transfers.splice(index, 1, transfer);
  }
}

export function editTextInStore(id: number, text: any) {
  storeStage.texts.splice(id, 1, text);
  console.log("Изменение текста в сторе", storeStage.texts);
}

export function editTransferInStore(id: number, transfer: any) {
  storeStage.transfers.splice(id, 1, transfer);
  console.log("Изменение перехода в сторе", storeStage.transfers);
}
