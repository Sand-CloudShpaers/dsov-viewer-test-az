import { Locatie } from '~ozon-model/locatie';
import { LocatieVM } from '~viewer/annotaties/types/locatieVM';

export interface ActiviteitenGroepVM {
  code: string;
  waarde: string;
  activiteiten?: ActiviteitVM[];
}

export interface ActiviteitVM {
  identificatie: string;
  naam: string;
}

export interface ActiviteitLocatieaanduidingenGroepVM {
  code?: string;
  waarde?: string;
  activiteitLocatieaanduidingen?: ActiviteitLocatieaanduidingVM[];
}

export interface ActiviteitLocatieaanduidingVM {
  identificatie: string;
  naam: string;
  regelkwalificatie: string;
  kwalificeertHref: string;
  isSelected: boolean;
  symboolcode?: string;
  isOntwerp?: boolean;
  procedurestatus?: string;
}

export interface AanduidingLocaties {
  id: string;
  locaties: Locatie[];
}

export interface AanduidingLocatiesVM {
  id: string;
  locaties: LocatieVM[];
}

export interface ViewSelectionItems {
  omgevingsnormen: SelectionSet[];
  omgevingswaarden: SelectionSet[];
  gebiedsaanwijzingen: SelectionSet[];
}

export interface SelectionSet {
  naam: string;
  identificatie: string;
}
