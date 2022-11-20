export interface KaartVM {
  identificatie: string;
  nummer: string;
  naam: string;
  kaartlagen: KaartlaagVM[];
  isOntwerp?: boolean;
}

export interface KaartlaagVM {
  identificatie: string;
  naam: string;
  niveau: number;
  isSelected: boolean;
  symboolcode?: string;
}
