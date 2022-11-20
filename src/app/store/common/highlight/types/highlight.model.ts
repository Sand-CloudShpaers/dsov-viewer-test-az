import { ApiSource } from '~model/internal/api-source';
import { Verbeelding } from '~ozon-model-verbeelden/verbeelding';
import { Selection } from '~store/common/selection/selection.model';

export interface Highlight {
  id: string;
  selections: Selection[];
  apiSource: ApiSource;
  verbeelding?: Verbeelding;
}
