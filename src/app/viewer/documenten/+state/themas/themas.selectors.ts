import { createSelector, MemoizedSelector } from '@ngrx/store';
import { selectDocumentenState, State } from '~viewer/documenten/+state';
import * as fromThemas from './themas.reducer';
import { derivedLoadingState } from '~general/utils/store.utils';
import { Thema } from '~ozon-model/thema';

const getThemaState = createSelector(selectDocumentenState, state => state[fromThemas.themasFeatureKey]);

const { selectEntities: selectThemaEntities } = fromThemas.adapter.getSelectors(getThemaState);

const selectThemaStatus = createSelector(getThemaState, fromThemas.getStatus);
export const getThemaStatus = createSelector(selectThemaStatus, derivedLoadingState);

export const selectThemasByDocumentId = (documentId: string): MemoizedSelector<State, Thema[]> =>
  createSelector(selectThemaEntities, (themaEntities): Thema[] => themaEntities[documentId]?.data ?? []);
