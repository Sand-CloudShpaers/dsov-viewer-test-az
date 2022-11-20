import { initialState, reducer as kaartenReducer } from './kaarten.reducer';
import * as KaartenActions from './kaarten.actions';
import { mockKaartenResponse } from '~viewer/documenten/+state/kaarten/kaarten.mock';
import { mockAnnotationEntityId } from '../annotaties.selectors.spec';

describe('kaartenReducer', () => {
  it('should have initial state', () => {
    const action = {};
    const actual = kaartenReducer(undefined, action as any);

    expect(actual).toEqual(initialState);
  });

  it('should add results on loadSuccess', () => {
    const action = KaartenActions.loadSuccess({
      vastgesteld: mockKaartenResponse,
      ontwerp: undefined,
      annotationId: {
        identificatie: 'regeltekstId',
        elementId: 'elementId',
      },
    });
    const actual = kaartenReducer(initialState, action);

    expect(actual.entities[mockAnnotationEntityId].data.vastgesteld).toEqual(mockKaartenResponse);

    expect(actual.entities[mockAnnotationEntityId].data.annotationId).toEqual({
      identificatie: 'regeltekstId',
      elementId: 'elementId',
    });
  });
});
