import { initialState, reducer as omgevingswaardenReducer } from './omgevingswaarden.reducer';
import * as fromOmgevingswaarden from './omgevingswaarden.actions';
import { mockOmgevingswaardenResponse } from '~viewer/gebieds-info/+state/omgevingswaarden/omgevingswaarden.mock';
import { mockAnnotationEntityId } from '../annotaties.selectors.spec';

describe('omgevingswaardenReducer', () => {
  it('should have initial state', () => {
    const action = {};
    const actual = omgevingswaardenReducer(undefined, action as any);

    expect(actual).toEqual(initialState);
  });

  it('should add results on loadSuccess', () => {
    const action = fromOmgevingswaarden.loadSuccess({
      vastgesteld: mockOmgevingswaardenResponse,
      annotationId: {
        identificatie: 'regeltekstId',
        elementId: 'elementId',
      },
    });
    const actual = omgevingswaardenReducer(initialState, action);

    expect(actual.entities[mockAnnotationEntityId].data.vastgesteld).toEqual(mockOmgevingswaardenResponse);

    expect(actual.entities[mockAnnotationEntityId].data.annotationId).toEqual({
      identificatie: 'regeltekstId',
      elementId: 'elementId',
    });
  });
});
