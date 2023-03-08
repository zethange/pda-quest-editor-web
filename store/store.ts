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

export function editTitleInStore(title: string) {
  storeStage.title = title;
}

export function editMessageInStore(message: string) {
  storeStage.message = message;
}

export function resetMessageInStore() {
  storeStage.message = "";
}

export function editTextInStore(id: number, text: any) {
  storeStage.texts.splice(id, 1, text);
  console.log("Изменение текста в сторе", storeStage.texts);
}

export function editTransferInStore(id: number, transfer: any) {
  storeStage.transfers.splice(id, 1, transfer);
  console.log("Изменение перехода в сторе", storeStage.transfers);
}

export function editMethodInAction(editedMethod: string, indexAction: number) {
  const arrayActions: any = Object.entries(storeStage.actions);
  arrayActions[indexAction][1] = editedMethod;
  storeStage.actions = Object.fromEntries(arrayActions);
  console.log("Изменение метода в action", storeStage.actions);
}

export function editParamInAction(
  editedParam: string,
  indexAction: number,
  indexParam: number
) {
  const arrayActions: any = Object.entries(storeStage.actions);
  arrayActions[indexAction][1][indexParam] = editedParam;
  storeStage.actions = Object.fromEntries(arrayActions);
  console.log("Изменение параметра в action", storeStage.actions);
}

export function newParamInAction(indexAction: number, param: string) {
  const arrayActions: any = Object.entries(storeStage.actions);
  arrayActions[indexAction][1].push(param);
  storeStage.actions = Object.fromEntries(arrayActions);
  console.log("Новый параметр в action", storeStage);
}

export function newMethodInAction(typeMethod: string = "add") {
  const arrayActions: any = Object.entries(storeStage.actions);
  arrayActions.push([typeMethod, []]);
  storeStage.actions = Object.fromEntries(arrayActions);
  console.log("Новый метод в action", storeStage);
}
