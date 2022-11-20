import * as fromActiviteitenMock from './activiteiten.mock';
import * as ActiviteitenActions from './activiteiten.actions';
import { initialState, reducer as activiteitenReducer } from './activiteiten.reducer';
import { LoadingState } from '~model/loading-state.enum';
import { Activiteiten } from '~ozon-model/activiteiten';

describe('ActiviteitenReducer', () => {
  const activiteitenMock: Activiteiten = fromActiviteitenMock.mockActiviteitenResponseWithNextHref;

  it('should have initial state', () => {
    const action = {};
    const actual = activiteitenReducer(undefined, action as any);

    expect(actual).toEqual(initialState);
  });

  it('should set status to PENDING on loadingActiviteiten', () => {
    const action = ActiviteitenActions.loadingActiviteiten({ activiteiten: [] });
    const actual = activiteitenReducer(initialState, action);

    expect(actual).toEqual({
      data: [],
      status: LoadingState.PENDING,
    });
  });

  it('should add results on loadActiviteitenSuccess', () => {
    const action = ActiviteitenActions.loadActiviteitenSuccess({
      activiteiten: activiteitenMock._embedded.activiteiten,
    });
    const actual = activiteitenReducer(initialState, action);

    expect(actual).toEqual({
      data: activiteitenMock._embedded.activiteiten,
      status: LoadingState.RESOLVED,
    });
  });

  it('should set status to REJECTED on loadOmgevingsnormenFailure', () => {
    const error = new Error('stuk');
    const action = ActiviteitenActions.loadActiviteitenFailure({ error });
    const actual = activiteitenReducer(initialState, action);

    expect(actual).toEqual({
      data: null,
      status: LoadingState.REJECTED,
      error,
    });
  });
});
