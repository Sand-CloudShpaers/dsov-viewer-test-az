import { Hoofdlijnen } from '~ozon-model/hoofdlijnen';
import { OntwerpHoofdlijnen } from '~ozon-model/ontwerpHoofdlijnen';

export interface HoofdlijnenEntity {
  documentId: string;
  vastgesteld?: Hoofdlijnen;
  ontwerp?: OntwerpHoofdlijnen;
}
export interface HoofdlijnVM {
  identificatie: string;
  naam: string;
  soort: string;
  isOntwerp?: boolean;
}
