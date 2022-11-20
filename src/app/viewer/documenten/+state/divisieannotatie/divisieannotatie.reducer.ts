import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import * as DivisieannotatieActions from './divisieannotatie.actions';
import { Divisieannotatie } from '~ozon-model/divisieannotatie';
import { OntwerpDivisieannotatie } from '~ozon-model/ontwerpDivisieannotatie';

export const divisieannotatieFeatureKey = 'divisieannotaties';

export interface DivisieannotatieEntity {
  id: string;
  documentIdentificatie: string;
  elementId?: string;
  vastgesteld?: Divisieannotatie;
  ontwerp?: OntwerpDivisieannotatie;
}

export type State = EntityState<DivisieannotatieEntity>;

export const adapter = createEntityAdapter<DivisieannotatieEntity>({
  selectId: divisies => divisies.id,
  sortComparer: false,
});

export const initialState: State = adapter.getInitialState({});

const divisieannotatieReducer = createReducer(
  initialState,
  on(
    DivisieannotatieActions.loadDivisieannotatieSuccess,
    (state, { documentstructuurelementId, vastgesteld, ontwerp }) => {
      {
        return adapter.upsertOne(
          {
            id: vastgesteld?.identificatie || ontwerp?.technischId,
            elementId: documentstructuurelementId,
            documentIdentificatie: vastgesteld?.documentIdentificatie || ontwerp?.documentTechnischId,
            vastgesteld,
            ontwerp,
          },
          state
        );
      }
    }
  )
);

export function reducer(state: State | undefined, action: Action): State {
  return divisieannotatieReducer(state, action);
}
