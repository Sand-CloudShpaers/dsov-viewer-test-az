import { DerivedLoadingState } from '~general/utils/store.utils';
import { FeaturesGroup } from '~viewer/annotaties/+state/bestemminsplan-features/bestemmingsplan-features.reducer';
import { ThemaVM } from '../+state/themas/themas.model';

export interface AnnotationVM {
  annotationId: AnnotationId;
  status?: DerivedLoadingState;
  typeRegelgeving?: string;
  themas?: ThemaVM[];
  vastgesteld?: AnnotationAttributesVM;
  ontwerp?: AnnotationAttributesVM;
}

export interface AnnotationAttributesVM {
  activiteitenHref?: string;
  omgevingswaardenHref?: string;
  omgevingsnormenHref?: string;
  gebiedsaanwijzingenHref?: string;
  locatiesHref?: string;
  idealisatieHref?: string;
  hoofdlijnenHref?: string;
  kaartenHref?: string;
  features?: FeaturesGroup[];
}

export interface AnnotationId {
  identificatie: string;
  elementId: string;
  technischId?: string;
}
