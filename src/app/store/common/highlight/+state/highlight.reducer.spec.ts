import { initialState, reducer, State } from './highlight.reducer';
import * as HighlightActions from './highlight.actions';
import { LoadingState } from '~model/loading-state.enum';
import { ApiSource } from '~model/internal/api-source';
import { mapboxStyleMock } from '~viewer/kaart/services/mapbox-style.mock';
import { MapboxStyle } from '~ozon-model-verbeelden//mapboxStyle';
import { SelectionObjectType } from '~store/common/selection/selection.model';

describe('highlightReducer', () => {
  const activeState: State = {
    ids: ['id'],
    entities: {
      ['id']: {
        status: LoadingState.RESOLVED,
        entityId: 'id',
        data: {
          id: 'id',
          apiSource: ApiSource.OZON,
          type: '[Highlight] Loading Success',
          verbeelding: { mapboxstyle: mapboxStyleMock, symboolmetadata: [] },
          selections: [
            {
              id: 'id',
              apiSource: ApiSource.OZON,
              objectType: SelectionObjectType.REGELINGSGEBIED,
              name: 'document',
            },
          ],
        },
      },
    },
    current: 'id',
    error: null,
  } as State;

  it('should have initial state', () => {
    const action = {};
    const actual = reducer(undefined, action as any);

    expect(actual).toEqual(initialState);
  });

  it('should have current set, after load', () => {
    const action = HighlightActions.load({
      id: 'id',
      apiSource: ApiSource.OZON,
      selections: [
        {
          id: 'id',
          apiSource: ApiSource.OZON,
          objectType: SelectionObjectType.REGELINGSGEBIED,
          name: 'document',
        },
      ],
    });
    const actual = reducer(initialState, action);

    expect(actual.current).toEqual(activeState.current);
  });

  it('should have entities set, after load succes', () => {
    const action = HighlightActions.loadingSuccess({
      id: 'id',
      apiSource: ApiSource.OZON,
      selections: [
        {
          id: 'id',
          apiSource: ApiSource.OZON,
          objectType: SelectionObjectType.REGELINGSGEBIED,
          name: 'document',
        },
      ],
      verbeelding: { mapboxstyle: mapboxStyleMock as MapboxStyle, symboolmetadata: [] },
    });
    const actual = reducer(initialState, action);

    expect(actual.ids).toEqual(activeState.ids);
    expect(actual.entities).toEqual(activeState.entities);
  });
});
