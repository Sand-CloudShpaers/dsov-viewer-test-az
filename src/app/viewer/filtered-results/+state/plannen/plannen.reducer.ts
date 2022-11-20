import { createEntityAdapter } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { LoadingState } from '~model/loading-state.enum';
import * as PlannenActions from './plannen.actions';
import { Plan } from '~ihr-model/plan';
import { Regeling } from '~ozon-model/regeling';
import { OntwerpRegeling } from '~ozon-model/ontwerpRegeling';
import { PlannenState } from '../plannen/types/plannenState';
import { Omgevingsvergunning } from '~ozon-model/omgevingsvergunning';

export const plannenRootKey = 'plannen';

export const adapterIhr = createEntityAdapter<Plan>({
  selectId: entity => entity.id,
});

export const adapterOzon = createEntityAdapter<Regeling | Omgevingsvergunning>({
  selectId: entity => entity.identificatie,
});

export const adapterOzonOntwerp = createEntityAdapter<OntwerpRegeling>({
  selectId: entity => entity.technischId,
});

export const initialState: PlannenState = {
  ihr: {
    gemeente: adapterIhr.getInitialState({ status: null, loadMoreUrl: null }),
    provincie: adapterIhr.getInitialState({ status: null, loadMoreUrl: null }),
    rijk: adapterIhr.getInitialState({ status: null, loadMoreUrl: null }),
  },
  ozon: adapterOzon.getInitialState({ status: null }),
  ozonOntwerp: adapterOzonOntwerp.getInitialState({ status: null }),
  isDirty: false,
  openSections: {
    gemeente: true,
    provincie: false,
    waterschap: false,
    rijk: false,
  },
};

const plannenReducer = createReducer(
  initialState,
  on(PlannenActions.ihrLoading, (state, { bestuurslaag }) => ({
    ...state,
    ihr: {
      ...state.ihr,
      [bestuurslaag]: { ...initialState.ihr[bestuurslaag], status: LoadingState.PENDING },
    },
  })),
  on(PlannenActions.ihrLoadError, (state, { bestuurslaag }) => ({
    ...state,
    ihr: {
      ...state.ihr,
      [bestuurslaag]: {
        ...state.ihr[bestuurslaag],
        status: LoadingState.REJECTED,
      },
    },
  })),
  on(PlannenActions.ihrLoadSuccess, (state, { ihrPlannen, bestuurslaag }) => ({
    ...state,
    ihr: {
      ...state.ihr,
      [bestuurslaag]: adapterIhr.setAll(ihrPlannen, { ...state.ihr[bestuurslaag], status: LoadingState.RESOLVED }),
    },
  })),
  on(PlannenActions.ihrSetNextUrl, (state, { bestuurslaag, href }) => ({
    ...state,
    ihr: {
      ...state.ihr,
      [bestuurslaag]: { ...state.ihr[bestuurslaag], loadMoreUrl: href },
    },
  })),
  on(PlannenActions.ihrLoadMore, (state, { bestuurslaag }) => ({
    ...state,
    ihr: {
      ...state.ihr,
      [bestuurslaag]: { ...state.ihr[bestuurslaag], status: LoadingState.PENDING },
    },
  })),
  on(PlannenActions.ihrLoadMoreSuccess, (state, { ihrPlannen, bestuurslaag }) => ({
    ...state,
    ihr: {
      ...state.ihr,
      [bestuurslaag]: adapterIhr.upsertMany(ihrPlannen, {
        ...state.ihr[bestuurslaag],
        status: LoadingState.RESOLVED,
      }),
    },
  })),
  on(PlannenActions.ozonLoading, state => ({
    ...state,
    ozon: {
      ...state.ozon,
      status: LoadingState.PENDING,
    },
  })),
  on(PlannenActions.ozonLoadError, state => ({
    ...state,
    ozon: {
      ...state.ozon,
      status: LoadingState.REJECTED,
    },
  })),

  on(PlannenActions.ozonLoadSuccess, (state, { regelingen }) => ({
    ...state,
    ozon: adapterOzon.upsertMany(regelingen, {
      ...state.ozon,
      status: LoadingState.RESOLVED,
    }),
  })),
  on(PlannenActions.ozonLoadSuccess, (state, { omgevingsvergunningen }) => ({
    ...state,
    ozon: adapterOzon.upsertMany(omgevingsvergunningen, {
      ...state.ozon,
      status: LoadingState.RESOLVED,
    }),
  })),
  on(PlannenActions.ozonLoadMoreSuccess, (state, { regelingen }) => ({
    ...state,
    ozon: adapterOzon.addMany(regelingen, {
      ...state.ozon,
      status: LoadingState.RESOLVED,
    }),
  })),
  on(PlannenActions.ozonOntwerpLoading, state => ({
    ...state,
    ozonOntwerp: {
      ...state.ozonOntwerp,
      status: LoadingState.PENDING,
    },
  })),
  on(PlannenActions.ozonOntwerpLoadError, state => ({
    ...state,
    ozonOntwerp: {
      ...state.ozonOntwerp,
      status: LoadingState.REJECTED,
    },
  })),
  on(PlannenActions.ozonOntwerpLoadSuccess, (state, { ontwerpRegelingen }) => ({
    ...state,
    ozonOntwerp: adapterOzonOntwerp.upsertMany(ontwerpRegelingen, {
      ...state.ozonOntwerp,
      status: LoadingState.RESOLVED,
    }),
  })),

  on(PlannenActions.ozonOntwerpLoadMoreSuccess, (state, { ontwerpRegelingen }) => ({
    ...state,
    ozonOntwerp: adapterOzonOntwerp.addMany(ontwerpRegelingen, {
      ...state.ozonOntwerp,
      status: LoadingState.RESOLVED,
    }),
  })),

  on(PlannenActions.toggleSection, (state, { bestuurslaag, open }) => ({
    ...state,
    openSections: {
      ...state.openSections,
      [bestuurslaag]: open,
    },
  })),

  on(PlannenActions.reset, () => ({
    ...initialState,
    isDirty: true,
  })),
  on(PlannenActions.setNotDirty, state => ({
    ...state,
    isDirty: false,
  }))
);

export function reducer(state: PlannenState | undefined, action: Action): PlannenState {
  return plannenReducer(state, action);
}
