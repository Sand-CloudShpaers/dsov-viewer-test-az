import { initialState, reducer as omgevingsnormenReducer } from './omgevingsnormen.reducer';
import * as fromOmgevingsnormen from './omgevingsnormen.actions';
import { mockOmgevingsnormenResponse } from '~viewer/gebieds-info/+state/omgevingsnormen/omgevingsnormen.mock';
import { mockAnnotationEntityId } from '../annotaties.selectors.spec';

describe('omgevingsnormenReducer', () => {
  it('should have initial state', () => {
    const action = {};
    const actual = omgevingsnormenReducer(undefined, action as any);

    expect(actual).toEqual(initialState);
  });

  it('should add results on loadSuccess', () => {
    const action = fromOmgevingsnormen.loadSuccess({
      vastgesteld: mockOmgevingsnormenResponse,
      annotationId: {
        identificatie: 'regeltekstId',
        elementId: 'elementId',
      },
    });
    const actual = omgevingsnormenReducer(initialState, action);

    expect(actual.entities[mockAnnotationEntityId].data.vastgesteld).toEqual(mockOmgevingsnormenResponse);

    expect(actual.entities[mockAnnotationEntityId].data.annotationId).toEqual({
      identificatie: 'regeltekstId',
      elementId: 'elementId',
    });
  });
});
