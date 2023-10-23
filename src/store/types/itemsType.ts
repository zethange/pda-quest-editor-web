export type itemsContainerType = {
  armors: ArmorDto[];
  weapons: WeaponDto[];
  artifacts: ArtifactDto[];
  bullets: ItemDto[];
  usual: ItemDto[];
  medicines: MedicineDto[];
  detectors: DetectorDto[];
};

export type itemType =
  | ArmorDto
  | WeaponDto
  | ArtifactDto
  | ItemDto
  | MedicineDto
  | DetectorDto;

export type ArmorDto = {
  id?: string;
  type?:
    | "ARMOR"
    | "PISTOL"
    | "RIFLE"
    | "MEDICINE"
    | "ARTIFACT"
    | "DETECTOR"
    | "BULLET"
    | "ITEM";
  icon?: string;
  title?: string;
  baseId?: number;
  weight?: number;
  price?: number;
  quantity?: number;
  thermalProtection?: number;
  electricProtection?: number;
  chemicalProtection?: number;
  radioProtection?: number;
  psyProtection?: number;
  damageProtection?: number;
  condition?: number;
  equipped?: boolean;
};
export type ArtifactDto = {
  id?: string;
  type?:
    | "ARMOR"
    | "PISTOL"
    | "RIFLE"
    | "MEDICINE"
    | "ARTIFACT"
    | "DETECTOR"
    | "BULLET"
    | "ITEM";
  icon?: string;
  title?: string;
  baseId?: number;
  weight?: number;
  price?: number;
  quantity?: number;
  health?: number;
  radio?: number;
  damage?: number;
  bleeding?: number;
  thermal?: number;
  chemical?: number;
  endurance?: number;
  electric?: number;
  equipped?: boolean;
};
export type DetectorDto = {
  id?: string;
  type?:
    | "ARMOR"
    | "PISTOL"
    | "RIFLE"
    | "MEDICINE"
    | "ARTIFACT"
    | "DETECTOR"
    | "BULLET"
    | "ITEM";
  icon?: string;
  title?: string;
  baseId?: number;
  weight?: number;
  price?: number;
  quantity?: number;
  detectorType?: "BASIC" | "MIDDLE" | "PROFESSIONAL";
  equipped?: boolean;
};
export type MedicineDto = {
  id?: string;
  type?:
    | "ARMOR"
    | "PISTOL"
    | "RIFLE"
    | "MEDICINE"
    | "ARTIFACT"
    | "DETECTOR"
    | "BULLET"
    | "ITEM";
  icon?: string;
  title?: string;
  baseId?: number;
  weight?: number;
  price?: number;
  quantity?: number;
  stamina?: number;
  radiation?: number;
  health?: number;
};
export type WeaponSound = {
  shot?: string;
  reload?: string;
};
export type WeaponDto = {
  id?: string;
  type?:
    | "ARMOR"
    | "PISTOL"
    | "RIFLE"
    | "MEDICINE"
    | "ARTIFACT"
    | "DETECTOR"
    | "BULLET"
    | "ITEM";
  icon?: string;
  title?: string;
  baseId?: number;
  weight?: number;
  price?: number;
  quantity?: number;
  precision?: number;
  speed?: number;
  damage?: number;
  condition?: number;
  bulletQuantity?: number;
  bulletId?: number;
  sounds?: WeaponSound;
  equipped?: boolean;
};
export type ItemDto = {
  id?: string;
  type?:
    | "ARMOR"
    | "PISTOL"
    | "RIFLE"
    | "MEDICINE"
    | "ARTIFACT"
    | "DETECTOR"
    | "BULLET"
    | "ITEM";
  icon?: string;
  title?: string;
  baseId?: number;
  weight?: number;
  price?: number;
  quantity?: number;
};
