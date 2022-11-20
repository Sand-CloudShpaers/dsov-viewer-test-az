import { DocumentDto } from '~viewer/documenten/types/documentDto';
import { ApiSource } from '~model/internal/api-source';

export interface Selection {
  id: string;
  name: string;
  apiSource: ApiSource;
  objectType?: SelectionObjectType;
  documentDto?: DocumentDto;
  symboolcode?: string;
  isOntwerp?: boolean;
  elementId?: string;
  // Alleen bij IHR objecten:
  locatieIds?: string[];
  // RegeltekstId, DivisieAnnotatieId (OZON)
  regeltekstIdentificatie?: string;
  regeltekstTechnischId?: string;
  // Alleen voor normwaardes en kaarten:
  parentId?: string;
  parentName?: string;
}

export enum SelectionObjectType {
  REGELINGSGEBIED = 'Regelingsgebied',
  BESTEMMINGSVLAK = 'Bestemmingsvlakken',
  GEBIEDSAANDUIDING = 'Gebiedsaanduidingen',
  FUNCTIEAANDUIDING = 'Functieaanduidingen',
  BOUWAANDUIDING = 'Bouwaanduidingen',
  MAATVOERING = 'Maatvoeringen',
  LETTERTEKENAANDUIDING = 'Lettertekenaanduidingen',
  ACTIVITEIT = 'Activiteit',
  GEBIEDSAANWIJZING = 'Gebiedsaanwijzing',
  OMGEVINGSNORM_NORMWAARDE = 'OmgevingsnormNormwaarde',
  OMGEVINGSWAARDE_NORMWAARDE = 'OmgevingswaardeNormwaarde',
  REGELTEKST_ACTIVITEITLOCATIEAANDUIDING = 'RegeltekstActiviteitlocatieaanduiding',
  KAART_KAARTLAAG = 'KaartKaartlaag',
  WERKINGSGEBIED = 'Werkingsgebied',
  HOOFDLIJN = 'Hoofdlijn',
}

export interface SymboolLocatie {
  symboolcode: string;
  locaties?: string[];
  niveau?: number;
}
