import { Selection } from '~store/common/selection/selection.model';

export interface LegendGroupVM {
  id?: string;
  name?: string;
  selections: Selection[];
}
