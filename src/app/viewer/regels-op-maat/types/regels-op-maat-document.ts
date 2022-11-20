import { ApiSource } from '~model/internal/api-source';
import { LoadingState } from '~model/loading-state.enum';
import { Divisieannotatie } from '~ozon-model/divisieannotatie';
import { Regeltekst } from '~ozon-model/regeltekst';
import { OntwerpDivisieannotatie } from '~ozon-model/ontwerpDivisieannotatie';
import { OntwerpRegeltekst } from '~ozon-model/ontwerpRegeltekst';
import { LoadMoreLinks } from './load-more-links';
import { Tekst } from '~ihr-model/tekst';

export interface RegelsOpMaatDocument {
  documentId: string;
  documentType: string;
  ozonOntwerpbesluitId?: string;
  regelteksten: Regeltekst[];
  ontwerpRegelteksten: OntwerpRegeltekst[];
  divisieannotaties: Divisieannotatie[];
  ontwerpDivisieannotaties: OntwerpDivisieannotatie[];
  teksten: Tekst[];
  apiSource?: ApiSource;
  loadMoreLinks?: LoadMoreLinks;
  statusLoadMore?: LoadingState;
}
