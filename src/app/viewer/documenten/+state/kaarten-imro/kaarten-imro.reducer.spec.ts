import {
  loadingStyleConfigs,
  loadStyleConfigsFailure,
  loadStylesSuccess,
} from '~viewer/documenten/+state/kaarten-imro/kaarten-imro.actions';

import {
  getStatus,
  initialState,
  reducer as kaartenImroReducer,
} from '~viewer/documenten/+state/kaarten-imro/kaarten-imro.reducer';
import { imroPlanResponseMock } from '~viewer/documenten/+state/kaarten-imro/kaarten-imro.selectors.spec';

const id = 'NL.IMRO.plan-met-kaarten-imro';

describe('kaartenImroReducer', () => {
  let actual;
  it('should have initial state', () => {
    const action = {};
    actual = kaartenImroReducer(undefined, action as any);

    expect(actual).toEqual(initialState);
  });

  it('should add kaartenImroConfigs with status PENDING', () => {
    const action = loadingStyleConfigs({
      documentId: id,
    });
    actual = kaartenImroReducer(initialState, action);

    expect(actual.entities['NL.IMRO.plan-met-kaarten-imro'].status).toEqual('PENDING');
  });

  it('should set status to REJECTED', () => {
    const action = loadStyleConfigsFailure({
      documentIds: [id],
    });
    actual = kaartenImroReducer(initialState, action);

    expect(actual.entities['NL.IMRO.plan-met-kaarten-imro'].status).toEqual('REJECTED');
  });

  it('should add kaartenconfigs on ', () => {
    const action = loadStylesSuccess({
      configs: [imroPlanResponseMock],
    });
    actual = kaartenImroReducer(initialState, action);

    expect(actual.ids).toEqual(['testId']);
    expect(getStatus(actual)).toEqual('RESOLVED');
  });
});
