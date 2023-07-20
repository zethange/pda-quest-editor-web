import { stageType } from "@/store/types/types";
import { mapType } from "@/store/types/mapType";

export function stageName(
  type_stage: number,
  stage?: stageType,
  maps?: mapType[]
) {
  // legacy черт возьми
  switch (type_stage) {
    case 0:
      return false;
    case 1:
      return false;
    case 2:
      return false;
    case 3:
      return false;
    case 4:
      return (
        'Переход на локацию "' +
        maps?.find((map) => +map.id === +stage?.data?.map!)?.title +
        '"'
      );
    case 5:
      return "Стадия с действиями";
    case 6:
      return "Продавец";
    case 7:
      return false;
    default:
      return false;
  }
}

export function stageTypes(type_stage: number) {
  switch (type_stage) {
    case 0:
      return "default";
    case 1:
      return "default";
    case 2:
      return "default";
    case 3:
      return "default";
    case 4:
      return "map";
    case 5:
      return "chapterEnd";
    case 6:
      return "seller";
    case 7:
      return "default";
    case 777:
      return "fromMap";
    default:
      return "unknown";
  }
}
