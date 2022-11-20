import { initialState, reducer as structuurElementenFiltersReducer } from './structuurelement-filter.reducer';
import * as DocumentStructuurelementFilterActions from '~viewer/documenten/+state/structuurelement-filter/structuurelement-filter.actions';
import { FilterType } from '~viewer/documenten/utils/document-utils';
import { LoadingState } from '~model/loading-state.enum';
import { StructuurElementFilter } from './structuurelement-filter.model';
import { EntityState } from '@ngrx/entity';
import { EntityPayload } from '~general/utils/state/entity-action';
import { documentDtoMock } from '~viewer/documenten/types/documentDto.mock';

const mockEntity: EntityPayload<StructuurElementFilter> = {
  entityId: 'documentId',
  data: {
    id: 'documentId',
    document: documentDtoMock,
    filterType: FilterType.thema,
    beschrijving: 'thema',
    themaId: 'themaId',
    hoofdlijnId: undefined,
  },
  status: LoadingState.PENDING,
};

const onAddState: EntityState<EntityPayload<StructuurElementFilter>> = {
  entities: {
    [mockEntity.entityId]: mockEntity,
  },
  ids: [mockEntity.entityId],
};

describe('structuurElementenFiltersReducer', () => {
  it('should have initial state', () => {
    const action = {};
    const actual = structuurElementenFiltersReducer(undefined, action as any);

    expect(actual).toEqual(initialState);
  });

  it('should add hoofdlijn filter', () => {
    const action = DocumentStructuurelementFilterActions.loadFilter({
      id: 'elementId',
      document: documentDtoMock,
      beschrijving: 'hoofdlijn',
      filterType: FilterType.hoofdlijn,
      hoofdlijnId: 'hoofdlijnId',
    });
    const actual = structuurElementenFiltersReducer(initialState, action);

    expect(actual.entities['elementId'].data.beschrijving).toEqual('hoofdlijn');
  });

  it('should add thema filter', () => {
    const addAction = DocumentStructuurelementFilterActions.loadFilter({
      id: 'documentId',
      document: documentDtoMock,
      beschrijving: 'thema',
      filterType: FilterType.thema,
      themaId: 'themaId',
    });
    const addState = structuurElementenFiltersReducer(initialState, addAction);

    expect(addState.entities[mockEntity.entityId]).toEqual({ ...mockEntity, status: LoadingState.PENDING });

    const removeAction = DocumentStructuurelementFilterActions.removeFilter({
      id: 'elementId',
    });
    const removeState = structuurElementenFiltersReducer(initialState, removeAction);

    expect(removeState.ids).toEqual([]);
  });

  it('should update filter, when success', () => {
    const action = DocumentStructuurelementFilterActions.loadFilterSuccess({
      id: mockEntity.entityId,
      divisieannotaties: [],
      regelteksten: [],
    });
    const actual = structuurElementenFiltersReducer(onAddState, action);

    expect(actual.entities[mockEntity.entityId]).toEqual({
      ...mockEntity,
      status: LoadingState.RESOLVED,
      data: {
        ...mockEntity.data,
        divisieannotaties: [],
        regelteksten: [],
      },
    });
  });

  it('should update filter, when failure', () => {
    const action = DocumentStructuurelementFilterActions.loadFilterFailure({
      id: mockEntity.entityId,
      error: null,
    });
    const actual = structuurElementenFiltersReducer(onAddState, action);

    expect(actual.entities[mockEntity.entityId]).toEqual({
      ...mockEntity,
      status: LoadingState.REJECTED,
      error: null,
    });
  });

  it('should remove all filters', () => {
    const action = DocumentStructuurelementFilterActions.removeFilters();
    const actual = structuurElementenFiltersReducer(onAddState, action);

    expect(actual).toEqual(initialState);
  });
});
