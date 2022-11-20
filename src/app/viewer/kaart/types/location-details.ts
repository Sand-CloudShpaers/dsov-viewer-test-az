export interface IhrObjectInfo {
  categorie: string;
  classificatie: string;
  naam: string;
  layer: IhrObjectInfoLayers;
  objectId: string;
  documentId: string;
  type: IhrObjectInfoTypes;
  symboolcode: string;
  labels: string[];
}

export type IhrObjectInfoTypes =
  | 'Enkelbestemming'
  | 'Dubbelbestemming'
  | 'Gebiedsaanduiding'
  | 'Bouwvlak'
  | 'Functieaanduiding'
  | 'Bouwaanduiding'
  | 'Figuur'
  | 'Maatvoering'
  | 'LetterTekenAanduiding';

export type IhrObjectInfoCategorieen = 'Enkelbestemming' | 'Dubbelbestemming' | 'Gebiedsaanduiding';

export type IhrObjectInfoLayers = 'planobject_polygon' | 'planobject_linestring' | 'planobject_point';
