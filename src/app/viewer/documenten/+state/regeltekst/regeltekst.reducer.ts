import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import * as RegeltekstActions from '~viewer/documenten/+state/regeltekst/regeltekst.actions';
import { Regeltekst } from '~ozon-model/regeltekst';
import { OntwerpRegeltekst } from '~ozon-model/ontwerpRegeltekst';

export const regeltekstFeatureKey = 'regelteksten';

export interface RegeltekstEntity {
  id: string;
  documentIdentificatie: string;
  elementId?: string;
  vastgesteld?: Regeltekst;
  ontwerp?: OntwerpRegeltekst;
}

export type State = EntityState<RegeltekstEntity>;

export const adapter = createEntityAdapter<RegeltekstEntity>({
  selectId: regeltekst => regeltekst.id,
  sortComparer: false,
});

export const initialState: State = adapter.getInitialState({});

const regeltekstReducer = createReducer(
  initialState,
  on(RegeltekstActions.loadRegelteksten, () => {
    {
      return adapter.removeAll(initialState);
    }
  }),
  on(RegeltekstActions.loadRegeltekstSuccess, (state, { documentstructuurelementId, vastgesteld, ontwerp }) => {
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
  }),
  on(RegeltekstActions.loadRegeltekstenSuccess, (state, { vastgesteld, ontwerp }) => {
    if (vastgesteld?.length) {
      return adapter.upsertMany(
        vastgesteld.map(regeltekst => ({
          id: regeltekst.identificatie,
          documentIdentificatie: regeltekst.documentIdentificatie,
          vastgesteld: regeltekst,
        })),
        state
      );
    }
    if (ontwerp?.length) {
      return adapter.upsertMany(
        ontwerp.map(regeltekst => ({
          id: regeltekst.technischId,
          documentIdentificatie: regeltekst.documentTechnischId,
          ontwerp: regeltekst,
        })),
        state
      );
    }
    return state;
  })
);

export function reducer(state: State | undefined, action: Action): State {
  return regeltekstReducer(state, action);
}
