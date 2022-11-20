import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { Tekst } from '~ihr-model/tekst';
import { DocumentComponenten } from '~ozon-model/documentComponenten';
import { OntwerpDocumentComponenten } from '~ozon-model/ontwerpDocumentComponenten';
import { LoadingState } from '~model/loading-state.enum';
import { findObjectInObjectWithKeyValue } from '~general/utils/object.utils';
import { EntityPayload } from '~general/utils/state/entity-action';
import { DocumentSubPagePath } from '~viewer/documenten/types/document-pages';
import * as DocumentStructuurActions from './document-structuur.actions';

export const documentStructuurFeatureKey = 'document-structuur';

export interface PayloadData {
  ozon: DocumentComponenten | OntwerpDocumentComponenten;
  ihr: {
    [key in DocumentSubPagePath]?: Tekst;
  };
}

export type State = EntityState<EntityPayload<PayloadData>>;

export const adapter = createEntityAdapter<EntityPayload<PayloadData>>({
  selectId: entity => entity.entityId,
  sortComparer: false,
});

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

const documentstructuurReducer = createReducer(
  initialState,
  on(DocumentStructuurActions.resetDocumentStructuur, _ => initialState),
  on(
    DocumentStructuurActions.loadOzonDocumentStructuur,
    (state, { id }): State => adapter.upsertOne({ status: LoadingState.PENDING, entityId: id, error: undefined }, state)
  ),
  on(DocumentStructuurActions.loadOzonDocumentStructuurSuccess, (state, { id, data }) =>
    adapter.upsertOne(
      {
        status: LoadingState.RESOLVED,
        entityId: id,
        data: { ozon: data, ihr: undefined },
      },
      state
    )
  ),

  on(DocumentStructuurActions.loadIhrDocumentOnderdeel, (state, { id }) =>
    adapter.upsertOne(
      {
        status: LoadingState.PENDING,
        entityId: id,
        // Bij het zetten op pending willen we een leeg object om aan te vullen, tenzij gevuld.
        // we assignen nu de huidige state bovenop de defaultwaardes, zodat we op zijn minst de defaultwaardes hebben
        data: state.entities[id]?.data || { ihr: {}, ozon: undefined },
      },
      state
    )
  ),

  on(DocumentStructuurActions.loadIhrDocumentOnderdeelSuccess, (state, { id, data, documentSubPagePath }) => {
    const entityData = state.entities[id]?.data;
    entityData.ihr[documentSubPagePath] = data;
    return adapter.updateOne(
      {
        id: id,
        changes: {
          data: entityData,
          status: LoadingState.RESOLVED,
        },
      },
      state
    );
  }),

  on(DocumentStructuurActions.loadIhrDocumentStructuurSuccess, (state, { id, parentId, data, addition }) => {
    const entityData = state.entities[id]?.data;
    const parent = findObjectInObjectWithKeyValue(entityData, 'id', parentId);
    if (parent) {
      parent._embedded = {
        children: addition ? parent._embedded.children.concat(data._embedded.teksten) : data._embedded.teksten,
      };
    }
    return adapter.updateOne(
      {
        id: id,
        changes: {
          data: entityData,
          status: LoadingState.RESOLVED,
        },
      },
      state
    );
  }),
  on(
    DocumentStructuurActions.loadDocumentStructuurFailure,
    (state, { id, error }): State => adapter.upsertOne({ status: LoadingState.REJECTED, entityId: id, error }, state)
  ),
  on(
    DocumentStructuurActions.setLoadingState,
    (state, { id, loadingState }): State =>
      adapter.updateOne(
        {
          id: id,
          changes: {
            status: loadingState,
          },
        },
        state
      )
  )
);

export function reducer(state: State | undefined, action: Action): State {
  return documentstructuurReducer(state, action);
}
