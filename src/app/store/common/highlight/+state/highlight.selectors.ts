import { createSelector, MemoizedSelector } from '@ngrx/store';
import { selectCommonState, State } from '~store/common';
import { Highlight } from '../types/highlight.model';
import * as fromHighlight from './highlight.reducer';

const getHighlightState = createSelector(selectCommonState, state => state[fromHighlight.featureKey]);

export const { selectEntities: selectHighlightEntities, selectAll: getHighlights } =
  fromHighlight.adapter.getSelectors(getHighlightState);

export const getHighlightById = (id: string): MemoizedSelector<State, Highlight> =>
  createSelector(selectHighlightEntities, entities => entities[id]?.data);

export const selectHighlights = createSelector(getHighlights, list => list.map(payload => payload.data));

export const getCurrent = createSelector(getHighlightState, fromHighlight.current);
