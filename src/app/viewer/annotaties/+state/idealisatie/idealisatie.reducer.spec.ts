import { initialState, reducer as idealisatieReducer } from './idealisatie.reducer';
import * as IdealisatieActions from './idealisatie.actions';
import { mockEmptyLocatiesResponse, mockLocatiesResponse } from '../locaties/locaties.mock';
import { AnnotationId } from '~viewer/documenten/types/annotation';
import { getAnnotationEntityId } from '~viewer/annotaties/helpers/annotaties';

export const mockAnnotationId: AnnotationId = { identificatie: 'regeltekstId', elementId: 'elementId' };
export const mockAnnotationEntityId = getAnnotationEntityId(mockAnnotationId);

export const IdealisatieFeatureEntitiesMock = {
  [mockAnnotationEntityId]: {
    entityId: mockAnnotationEntityId,
    status: 'RESOLVED',
    data: mockLocatiesResponse,
  },
  [mockAnnotationEntityId + '2']: {
    entityId: mockAnnotationEntityId + '2',
    status: 'RESOLVED',
    data: mockEmptyLocatiesResponse,
  },
};

describe('idealisatieReducer', () => {
  it('should have initial state', () => {
    const action = {};
    const actual = idealisatieReducer(undefined, action as any);

    expect(actual).toEqual(initialState);
  });

  it('should add results on loadSuccess', () => {
    const action = IdealisatieActions.loadSuccess({
      locaties: mockLocatiesResponse,
      annotationId: {
        identificatie: 'regeltekstId',
        elementId: 'elementId',
      },
    });
    const actual = idealisatieReducer(initialState, action);

    expect(actual.entities[mockAnnotationEntityId].data).toEqual(mockLocatiesResponse);
  });
});
