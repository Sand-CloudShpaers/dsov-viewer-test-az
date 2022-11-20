import { KaartZoekParameter } from '~ozon-model/kaartZoekParameter';
import { LoadingState } from '~model/loading-state.enum';
import { mockKaartenResponse } from './kaarten.mock';
import * as KaartenActions from './kaarten.actions';
import { getStatus, initialState, reducer as kaartenReducer } from './kaarten.reducer';

describe('Kaarten Reducer', () => {
  it('should have initial state', () => {
    const action = {};
    const actual = kaartenReducer(undefined, action as any);

    expect(actual).toEqual(initialState);
  });

  it('should set status to PENDING on loadKaarten', () => {
    const action = KaartenActions.loadKaarten({
      zoekParameters: [
        {
          parameter: KaartZoekParameter.ParameterEnum.DocumentIdentificatie,
          zoekWaarden: [''],
        },
      ],
      documentId: 'testDocumentId',
      kaarten: [],
    });
    const actual = kaartenReducer(initialState, action);

    expect(actual.entities).toEqual({
      ['testDocumentId']: {
        entityId: 'testDocumentId',
        status: LoadingState.PENDING,
      },
    });
  });

  it('should add results on loadKaartenSuccess', () => {
    const action = KaartenActions.loadKaartenSuccess({
      documentId: 'testDocumentId',
      kaarten: mockKaartenResponse._embedded.kaarten,
    });
    const actual = kaartenReducer(initialState, action);

    expect(actual.entities).toEqual({
      ['testDocumentId']: {
        entityId: 'testDocumentId',
        data: mockKaartenResponse._embedded.kaarten,
        status: LoadingState.RESOLVED,
      },
    });
  });

  it('should set status to REJECTED on loadKaartenFailure', () => {
    const error = new Error('stuk');
    const action = KaartenActions.loadKaartenFailure({ documentId: 'testDocumentId', error });
    const actual = kaartenReducer(initialState, action);

    expect(actual.entities).toEqual({
      ['testDocumentId']: {
        entityId: 'testDocumentId',
        status: LoadingState.REJECTED,
        error,
      },
    });

    expect(getStatus(actual)).toEqual('REJECTED');
  });
});
