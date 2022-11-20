import { DocumentDto } from '~viewer/documenten/types/documentDto';
import { FilterType } from '~viewer/documenten/utils/document-utils';
import { DivisieannotatieEntity } from '../divisieannotatie/divisieannotatie.reducer';
import { RegeltekstEntity } from '../regeltekst/regeltekst.reducer';

export interface StructuurElementFilter {
  id: string;
  document: DocumentDto;
  beschrijving: string;
  filterType: FilterType;
  themaId?: string;
  hoofdlijnId?: string;
  divisieannotaties?: DivisieannotatieEntity[];
  regelteksten?: RegeltekstEntity[];
}
