import { LoadingState } from '~model/loading-state.enum';
import { derivedLoadingState } from './store.utils';

describe('store utils', () => {
  describe('derivedLoadingState', () => {
    it('should handle undefined', () => {
      const result = derivedLoadingState(undefined);

      expect(result).toEqual({
        isLoading: false,
        isLoaded: false,
        isIdle: false,
        isPending: false,
        isRejected: false,
        isResolved: false,
      });
    });

    it('should handle null', () => {
      const result = derivedLoadingState(null);

      expect(result).toEqual({
        isLoading: false,
        isLoaded: false,
        isIdle: false,
        isPending: false,
        isRejected: false,
        isResolved: false,
      });
    });

    it('`LoadingState.IDLE` should result in `isIdle: true`', () => {
      const result = derivedLoadingState(LoadingState.IDLE);

      expect(result).toEqual({
        isLoading: true,
        isLoaded: false,
        isIdle: true,
        isPending: false,
        isRejected: false,
        isResolved: false,
      });
    });

    it('`LoadingState.PENDING` should result in `isPending: true`', () => {
      const result = derivedLoadingState(LoadingState.PENDING);

      expect(result).toEqual({
        isLoading: true,
        isLoaded: false,
        isIdle: false,
        isPending: true,
        isRejected: false,
        isResolved: false,
      });
    });

    it('`LoadingState.RESOLVED` should result in `isResolved: true`', () => {
      const result = derivedLoadingState(LoadingState.RESOLVED);

      expect(result).toEqual({
        isLoading: false,
        isLoaded: true,
        isIdle: false,
        isPending: false,
        isRejected: false,
        isResolved: true,
      });
    });

    it('`LoadingState.REJECTED` should result in `isRejected: true`', () => {
      const result = derivedLoadingState(LoadingState.REJECTED);

      expect(result).toEqual({
        isLoading: false,
        isLoaded: true,
        isIdle: false,
        isPending: false,
        isRejected: true,
        isResolved: false,
      });
    });
  });
});
