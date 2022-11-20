import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import * as BestemmingsplanFeaturesActions from './bestemmingsplan-features.actions';
import { EntityPayload } from '~general/utils/state/entity-action';
import { LoadingState } from '~model/loading-state.enum';
import * as AnnotatiesActions from '../annotaties.actions';
import { Bestemmingsvlak } from '~ihr-model/bestemmingsvlak';
import { Gebiedsaanduiding } from '~ihr-model/gebiedsaanduiding';
import { Functieaanduiding } from '~ihr-model/functieaanduiding';
import { Maatvoering } from '~ihr-model/maatvoering';
import { Bouwaanduiding } from '~ihr-model/bouwaanduiding';
import { SelectionObjectType } from '~store/common/selection/selection.model';
import { getAnnotationEntityId } from '~viewer/annotaties/helpers/annotaties';

export const bestemmingsplanFeaturesRootKey = 'bestemmingsplan-features';

export interface FeaturesGroup {
  objectType: SelectionObjectType;
  hrefs: string[];
}

export interface Feature {
  objectType: SelectionObjectType;
  documentId: string;
  feature: Bestemmingsvlak | Gebiedsaanduiding | Functieaanduiding | Maatvoering | Bouwaanduiding;
}

export type State = EntityState<EntityPayload<Feature[]>>;

export const adapter = createEntityAdapter<EntityPayload<Feature[]>>({
  selectId: bestemmingsplanFeatures => bestemmingsplanFeatures.entityId,
  sortComparer: false,
});

export const initialState: State = adapter.getInitialState({
  error: null,
});

const bestemmingsplanFeaturesReducer = createReducer(
  initialState,
  on(BestemmingsplanFeaturesActions.loading, (state, { annotationId }) =>
    adapter.upsertOne({ entityId: getAnnotationEntityId(annotationId), status: LoadingState.PENDING }, state)
  ),
  on(BestemmingsplanFeaturesActions.loadSuccess, (state, { annotationId, features }) =>
    adapter.upsertOne(
      { entityId: getAnnotationEntityId(annotationId), data: features, status: LoadingState.RESOLVED },
      state
    )
  ),
  on(BestemmingsplanFeaturesActions.loadError, (state, { annotationId }) =>
    adapter.upsertOne({ entityId: getAnnotationEntityId(annotationId), status: LoadingState.REJECTED }, state)
  ),
  on(AnnotatiesActions.resetState, () => initialState)
);

export function reducer(state: State | undefined, action: Action): State {
  return bestemmingsplanFeaturesReducer(state, action);
}
