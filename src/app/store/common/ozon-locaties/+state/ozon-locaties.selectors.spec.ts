import { LoadingState } from '~model/loading-state.enum';
import { initialState } from './ozon-locaties.reducer';
import * as fromSelectors from './ozon-locaties.selectors';

describe('Ozon Locaties Selectors', () => {
  it('should return loading status', () => {
    expect(fromSelectors.selectOzonLocatiesStatus.projector({ ...initialState, status: LoadingState.PENDING })).toEqual(
      {
        isRejected: false,
        isIdle: false,
        isLoaded: false,
        isLoading: true,
        isPending: true,
        isResolved: false,
      }
    );
  });
});
