import { initialState, reducer as hoofdlijnenReducer } from './hoofdlijnen.reducer';
import * as fromHoofdlijnen from './hoofdlijnen.actions';
import { mockHoofdlijnenResponse } from '~viewer/documenten/+state/hoofdlijnen/hoofdlijnen.mock';
import { mockAnnotationEntityId } from '../annotaties.selectors.spec';

describe('hoofdlijnenReducer', () => {
  it('should have initial state', () => {
    const action = {};
    const actual = hoofdlijnenReducer(undefined, action as any);

    expect(actual).toEqual(initialState);
  });

  it('should add results on loadSuccess', () => {
    const action = fromHoofdlijnen.loadSuccess({
      vastgesteld: mockHoofdlijnenResponse,
      ontwerp: undefined,
      annotationId: {
        identificatie: 'regeltekstId',
        elementId: 'elementId',
      },
    });
    const actual = hoofdlijnenReducer(initialState, action);

    expect(actual.entities[mockAnnotationEntityId].data.vastgesteld).toEqual(mockHoofdlijnenResponse);

    expect(actual.entities[mockAnnotationEntityId].data.annotationId).toEqual({
      identificatie: 'regeltekstId',
      elementId: 'elementId',
    });
  });
});
