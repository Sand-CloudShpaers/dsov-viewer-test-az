import { ApiSource } from '~model/internal/api-source';
import { FilterIdentification } from '~viewer/filter/types/filter-options';

export enum RegelStatus {
  InVoorbereiding = 'inVoorbereiding',
  Geldend = 'geldend',
}

export enum IhrRegelStatus {
  Vastgesteld = 'geldend',
  Ontwerp = 'in ontwikkeling',
}

export enum RegelsbeleidKeys {
  Regels = 'regels',
  Beleid = 'beleid',
}

export const RegelsbeleidType = {
  regels: {
    id: 'regels',
    group: 'regelsbeleidType',
    name: 'Regels',
    applicableToSources: [ApiSource.IHR, ApiSource.OZON],
  },
  beleid: {
    id: 'beleid',
    group: 'regelsbeleidType',
    name: 'Beleid',
    applicableToSources: [ApiSource.IHR, ApiSource.OZON],
  },
};

export const RegelStatusType = {
  [RegelStatus.Geldend]: {
    id: RegelStatus.Geldend,
    group: 'regelStatus',
    name: 'Geldend',
    applicableToSources: [ApiSource.IHR, ApiSource.OZON],
    label: {
      removable: false,
      name: undefined,
      hide: false,
    },
  } as FilterIdentification,
  [RegelStatus.InVoorbereiding]: {
    id: RegelStatus.InVoorbereiding,
    group: 'regelStatus',
    name: 'In voorbereiding',
    applicableToSources: [ApiSource.IHR, ApiSource.OZON],
  } as FilterIdentification,
};
