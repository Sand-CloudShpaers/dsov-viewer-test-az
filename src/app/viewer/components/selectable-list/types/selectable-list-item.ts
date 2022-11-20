import { ApiSource } from '~model/internal/api-source';
import { Selection } from '~store/common/selection/selection.model';

export interface SelectableVM {
  identificatie: string;
  naam: string;
  isExpanded: boolean;
  lists: SelectableListVM[];
  embedded?: SelectableVM[];
}

export interface SelectableListVM {
  items: SelectableListItemVM[];
  group?: {
    apiSource: ApiSource;
    identificatie: string;
    naam: string;
    subLabel?: string;
    symboolcode?: string;
  };
}

export interface SelectableListItemVM extends Selection {
  isSelected: boolean;
  representationLabel?: string;
  labelPrefix?: string;
  kwalificatie?: string;
  niveau?: number;
  isInFilter?: boolean;
  isHidden?: boolean;
}
