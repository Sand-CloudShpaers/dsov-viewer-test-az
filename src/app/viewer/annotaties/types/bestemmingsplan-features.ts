import { SelectionObjectType } from '~store/common/selection/selection.model';

export interface BestemmingsplanFeatureGroupVM {
  id: string;
  objectType: SelectionObjectType;
  features: BestemmingsplanFeatureVM[];
}

export interface BestemmingsplanFeatureVM {
  id: string;
  naam: string;
  symboolcode: string;
  isSelected: boolean;
  locatieIds: string[];
}
