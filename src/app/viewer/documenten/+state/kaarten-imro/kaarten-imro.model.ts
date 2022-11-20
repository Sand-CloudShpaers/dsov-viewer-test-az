import { PlanType } from '~ihr-model/planType';
import { Style } from 'mapbox-gl';

export interface ImroPlanResponse {
  id: string;
  type: PlanType;
  documentType: string;
  naam: string;
  bounds: number[];
  styles: ImroKaartStyleConfig[];
}

export interface ImroKaartStyleConfig {
  id: string;
  naam: string;
  url: string;
  style?: Style;
}
