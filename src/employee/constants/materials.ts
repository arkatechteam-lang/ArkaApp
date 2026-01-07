 import { Material } from "../types";

export const MATERIALS: Material[] = [
  "Wet Ash",
  "Marble Powder",
  "Crusher Powder",
  "Fly Ash Powder",
  "Cement",
];

export const MATERIAL_UNITS: Record<Material, string> = {
  "Wet Ash": "tons",
  "Marble Powder": "tons",
  "Crusher Powder": "units",
  "Fly Ash Powder": "tons",
  "Cement": "bags",
};
