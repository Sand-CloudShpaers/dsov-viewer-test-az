import { initialState, reducer } from './ozon-locaties.reducer';
import * as OzonLocatiesActions from './ozon-locaties.actions';
import { LoadingState } from '~model/loading-state.enum';

describe('Ozon Locaties Reducer', () => {
  it('should have initial state', () => {
    const action = {};
    const actual = reducer(undefined, action as any);

    expect(actual).toEqual(initialState);
  });

  it('should set loading state on pending when loading', () => {
    const action = OzonLocatiesActions.loading({
      activeLocation: null,
    });
    const actual = reducer(initialState, action);

    expect(actual).toEqual({ ...initialState, status: LoadingState.PENDING });
  });

  it('should set state with ozon locaties when success', () => {
    const action = OzonLocatiesActions.loadSuccess({
      locatieIds: [],
      ontwerpLocatieTechnischIds: [],
      omgevingsplanPons: true,
    });
    const actual = reducer(initialState, action);

    expect(actual).toEqual({
      ...initialState,
      status: LoadingState.RESOLVED,
      locatieIds: [],
      ontwerpLocatieTechnischIds: [],
      omgevingsplanPons: true,
    });
  });

  it('should set loading state on rejected when failed', () => {
    const action = OzonLocatiesActions.loadError({
      error: null,
    });
    const actual = reducer(initialState, action);

    expect(actual).toEqual({ ...initialState, status: LoadingState.REJECTED, error: null });
  });

  it('should have initial state after reset', () => {
    const action = OzonLocatiesActions.reset();
    const actual = reducer(
      {
        ...initialState,
        status: LoadingState.RESOLVED,
        locatieIds: [],
        ontwerpLocatieTechnischIds: [],
        omgevingsplanPons: true,
      },
      action as any
    );

    expect(actual).toEqual(initialState);
  });
});
