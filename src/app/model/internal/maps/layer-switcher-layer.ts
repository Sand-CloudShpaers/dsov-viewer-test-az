import { Observable } from 'rxjs';

export type LayerName = 'informatielagen' | 'achtergrondlagen';

export interface LayerSwitcherLayer {
  id: string;
  title: string;
  outOfZoom$: Observable<boolean>;
  active?: boolean;
  selected?: boolean;
  background?: boolean;
  icon?: string;
  groupName?: string;
}

export interface LayerSelection {
  selected: boolean;
}
