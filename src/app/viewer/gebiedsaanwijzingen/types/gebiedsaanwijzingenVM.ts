// groepering van gebiedsaanwijzingen per type
export interface GebiedsaanwijzingenVM {
  gebiedsaanwijzingType: string;
  label: string;
  gebiedsaanwijzingen: GebiedsaanwijzingVM[];
}

export interface GebiedsaanwijzingVM {
  identificatie: string;
  naam: string;
  groep: string;
  isSelected: boolean;
  symboolcode?: string;
  isOntwerp?: boolean;
  type?: string;
}
