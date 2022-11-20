import { LoadingState } from '~model/loading-state.enum';

export interface DerivedLoadingState {
  isLoading: boolean;
  isIdle: boolean;
  isPending: boolean;
  isResolved: boolean;
  isRejected: boolean;
  isLoaded: boolean;
}

export function derivedLoadingState(status: LoadingState): DerivedLoadingState {
  return {
    isLoading: status === LoadingState.IDLE || status === LoadingState.PENDING,
    isLoaded: status === LoadingState.RESOLVED || status === LoadingState.REJECTED,
    isIdle: status === LoadingState.IDLE,
    isPending: status === LoadingState.PENDING,
    isResolved: status === LoadingState.RESOLVED,
    isRejected: status === LoadingState.REJECTED,
  };
}

export function simplifiedLoadingState(statusses: DerivedLoadingState): string {
  const states = Object.keys(statusses).filter(key => statusses[key as keyof DerivedLoadingState]);

  const checkKey = (keys: string[]): boolean => states.some(stateKey => keys.includes(stateKey));

  if (checkKey(['isLoading'])) {
    return 'isLoading';
  } else if (checkKey(['isResolved'])) {
    return 'isResolved';
  } else if (checkKey(['isRejected'])) {
    return 'isRejected';
  }

  return '';
}
