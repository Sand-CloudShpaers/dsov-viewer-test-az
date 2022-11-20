import { initialState, reducer as locatiesReducer } from './locaties.reducer';
import * as fromLocaties from './locaties.actions';
import { mockLocatiesResponse } from './locaties.mock';
import { mockAnnotationEntityId } from '../annotaties.selectors.spec';

describe('locatiesReducer', () => {
  it('should have initial state', () => {
    const action = {};
    const actual = locatiesReducer(undefined, action as any);

    expect(actual).toEqual(initialState);
  });

  it('should add results on loadSuccess', () => {
    const action = fromLocaties.loadSuccess({
      vastgesteld: mockLocatiesResponse,
      ontwerp: undefined,
      annotationId: {
        identificatie: 'regeltekstId',
        elementId: 'elementId',
      },
    });
    const actual = locatiesReducer(initialState, action);

    expect(actual.entities[mockAnnotationEntityId].data.vastgesteld).toEqual(mockLocatiesResponse);

    expect(actual.entities[mockAnnotationEntityId].data.ontwerp).toEqual(undefined);
  });
});
