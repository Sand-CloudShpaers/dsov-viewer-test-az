import { NormType } from '~viewer/annotaties/types/annotaties-enums';

export interface OmgevingsnormenVM {
  identificatie: string;
  naam: string;
  normen: OmgevingsnormVM[];
}

export interface OmgevingsnormVM {
  identificatie: string;
  naam: string;
  eenheid?: string;
  type: string;
  normType: NormType;
  normwaarden?: OmgevingsnormwaardeVM[];
}

export interface OmgevingsnormwaardeVM {
  identificatie: string;
  naam: string;
  isSelected: boolean;
  isOntwerp?: boolean;
  symboolcode?: string;
  representationLabel?: string;
}
