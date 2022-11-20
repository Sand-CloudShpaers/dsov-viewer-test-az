import { ZoekParameters } from '~general/utils/filter.utils';

export interface LoadMoreLinks {
  vastgesteld: {
    regelteksten?: LoadMoreLink;
    divisieannotaties?: LoadMoreLink;
    teksten?: LoadMoreLink;
  };
  ontwerp?: {
    regeltekstenVastgesteldeLocaties?: LoadMoreLink;
    regeltekstenOntwerpLocaties?: LoadMoreLink;
    divisieannotatiesVastgesteldeLocaties?: LoadMoreLink;
    divisieannotatiesOntwerpLocaties?: LoadMoreLink;
  };
}

export interface LoadMoreLink {
  href: string;
  zoekParameters: ZoekParameters[];
}
