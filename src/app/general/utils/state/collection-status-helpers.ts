import { EntityState } from '@ngrx/entity';
import { LoadingState } from '~model/loading-state.enum';
import { EntityPayload } from './entity-action';

export function getCollectionStatus<T extends EntityPayload>(state?: EntityState<T>): LoadingState {
  const values = Object.values(state?.entities ?? {});
  const _isLoading = values.some(value => value.status === LoadingState.PENDING);

  if (_isLoading) {
    return LoadingState.PENDING;
  }

  // Every always returns true on an empty array
  const areAllFailed = values.length > 0 && values.every(value => value.status === LoadingState.REJECTED);

  if (areAllFailed) {
    return LoadingState.REJECTED;
  }
  if (values.length > 0) {
    return LoadingState.RESOLVED;
  }

  return LoadingState.IDLE;
}
