import { createSelector, MemoizedSelector } from '@ngrx/store';
import { LayoutState, LayoutStateVM } from '~viewer/documenten/types/layout.model';
import { createDerivedLayoutStateOpen } from '~viewer/documenten/utils/layout.util';
import { selectCurrentElementId } from './documenten/documenten.selectors';
import { selectDocumentenState, State } from './index';
import * as fromLayout from './layout.reducer';

const getLayoutState = createSelector(selectDocumentenState, state => state[fromLayout.documentStructuurLayoutKey]);

const selectCollapse = (documentId: string): MemoizedSelector<State, { [p: string]: LayoutState }> =>
  createSelector(getLayoutState, state => state[documentId]?.collapse);

const selectAnnotaties = (documentId: string): MemoizedSelector<State, { [p: string]: LayoutState }> =>
  createSelector(getLayoutState, state => state[documentId]?.annotaties);

export const selectLayoutStateVM = (documentId: string): MemoizedSelector<State, LayoutStateVM> =>
  createSelector(
    selectCollapse(documentId),
    selectAnnotaties(documentId),
    selectCurrentElementId,
    (collapse, annotaties, selectedElementId) => {
      const vm: LayoutStateVM = {};
      if (collapse) {
        for (const [id, state] of Object.entries(collapse)) {
          vm[id] = { collapse: createDerivedLayoutStateOpen(state) };
        }
      }
      if (annotaties) {
        for (const [id, state] of Object.entries(annotaties)) {
          const entry = vm[id];
          if (entry) {
            vm[id] = {
              ...vm[id],
              annotaties: createDerivedLayoutStateOpen(state),
            };
          } else {
            vm[id] = { annotaties: createDerivedLayoutStateOpen(state) };
          }
        }
      }
      if (selectedElementId) {
        const entry = vm[selectedElementId];
        if (entry) {
          vm[selectedElementId] = {
            ...vm[selectedElementId],
            isSelected: true,
          };
        } else {
          vm[selectedElementId] = { isSelected: true };
        }
      }
      return vm;
    }
  );
