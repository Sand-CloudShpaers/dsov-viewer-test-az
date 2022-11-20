import { initialState, reducer as selectionReducer, State } from './selection.reducer';
import * as SelectionActions from '~store/common/selection/+state/selection.actions';
import { LoadingState } from '~model/loading-state.enum';
import { selectionMock } from './selection-mock';

describe('selectionReducer', () => {
  const activeState: State = {
    ids: [selectionMock.id],
    entities: {
      [selectionMock.id]: {
        status: LoadingState.RESOLVED,
        entityId: selectionMock.id,
        data: selectionMock,
      },
    },
    error: null,
  } as State;

  it('should have initial state', () => {
    const action = {};
    const actual = selectionReducer(undefined, action as any);

    expect(actual).toEqual(initialState);
  });

  it('should have updated state with selections', () => {
    const action = SelectionActions.updateSelections({ selections: [selectionMock] });
    const actual = selectionReducer(initialState, action);

    expect(actual).toEqual(activeState);
  });
});
