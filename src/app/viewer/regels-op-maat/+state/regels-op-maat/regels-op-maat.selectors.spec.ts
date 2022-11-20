import * as fromSelectors from './regels-op-maat.selectors';
import { LoadingState } from '~model/loading-state.enum';
import { derivedLoadingState } from '~general/utils/store.utils';

describe('Regels op maat Selectors', () => {
  describe('selectRegelsOpMaatStatus', () => {
    it('should return RESOLVED status', () => {
      expect(
        fromSelectors.selectRegelsOpMaatStatus.projector({
          loadingState: LoadingState.RESOLVED,
        })
      ).toEqual(derivedLoadingState(LoadingState.RESOLVED));
    });
  });
});
