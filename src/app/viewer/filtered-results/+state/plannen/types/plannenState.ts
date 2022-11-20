import { EntityState } from '@ngrx/entity';
import { Plan } from '~ihr-model/plan';
import { LoadingState } from '~model/loading-state.enum';
import { Regeling } from '~ozon-model/regeling';
import { OntwerpRegeling } from '~ozon-model/ontwerpRegeling';
import { Omgevingsvergunning } from '~ozon-model/omgevingsvergunning';

export interface IhrState {
  gemeente?: IHRBestuurslaagState;
  provincie?: IHRBestuurslaagState;
  waterschap?: IHRBestuurslaagState;
  rijk?: IHRBestuurslaagState;
}

export interface IHRBestuurslaagState extends EntityState<Plan> {
  status: LoadingState | null;
  loadMoreUrl: string | null;
}

interface OzonState extends EntityState<Regeling | Omgevingsvergunning> {
  status: LoadingState | null;
}

interface OzonOntwerpState extends EntityState<OntwerpRegeling> {
  status: LoadingState | null;
}

export interface PlannenState {
  ihr: IhrState;
  ozon: OzonState;
  ozonOntwerp: OzonOntwerpState;
  isDirty: boolean;
  openSections: {
    gemeente: boolean;
    provincie: boolean;
    waterschap: boolean;
    rijk: boolean;
  };
}
