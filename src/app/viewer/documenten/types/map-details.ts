export interface IMROCartografieInfoVM {
  naam: string;
  nummer: number;
  details: IMROCartografieInfoDetailVM[];
}

export interface IMROCartografieInfoDetailVM {
  id: string;
  naam: string;
  type: string;
  symboolcode: string;
  themas?: string[];
  externalLinks?: string[];
  labels?: string[];
  categorie?: string;
  classificatie?: string;
  selected: boolean;
  internalLinks?: {
    href: string;
    id: string;
  }[];
}

export type IMROObjectType =
  | 'Enkelbestemming'
  | 'Dubbelbestemming'
  | 'Gebiedsaanduiding'
  | 'Bouwvlak'
  | 'Functieaanduiding'
  | 'Bouwaanduiding'
  | 'Figuur'
  | 'Maatvoering'
  | 'LetterTekenAanduiding';

export type IhrObjectInfoLayers = 'planobject_polygon' | 'planobject_linestring' | 'planobject_point';
