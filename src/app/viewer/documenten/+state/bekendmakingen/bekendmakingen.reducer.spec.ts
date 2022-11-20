import {
  getStatus,
  initialState,
  reducer as bekendmakingenReducer,
} from '~viewer/documenten/+state/bekendmakingen/bekendmakingen.reducer';
import {
  loadIhrBekendmakingenFailure,
  loadIhrBekendmakingenSuccess,
  loading,
} from '~viewer/documenten/+state/bekendmakingen/bekendmakingen.actions';
import { bekendmakingenMock } from '~viewer/documenten/+state/bekendmakingen/bekendmakingen.selectors.spec';

const id = 'NL.IMRO.plan-met-bekendmakingen';

describe('bekendmakingenReducer', () => {
  let actual;
  it('should have initial state', () => {
    const action = {};
    actual = bekendmakingenReducer(undefined, action as any);

    expect(actual).toEqual(initialState);
  });

  it('should add bekendmakingen with status PENDING', () => {
    const action = loading({
      documentId: id,
    });
    actual = bekendmakingenReducer(initialState, action);

    expect(actual.entities['NL.IMRO.plan-met-bekendmakingen'].status).toEqual('PENDING');
  });

  it('should set status to REJECTED', () => {
    const action = loadIhrBekendmakingenFailure({
      documentId: id,
    });
    actual = bekendmakingenReducer(initialState, action);

    expect(actual.entities['NL.IMRO.plan-met-bekendmakingen'].status).toEqual('REJECTED');
  });

  it('should add bekendmakingen on loadBekendmakingenSuccess', () => {
    const action = loadIhrBekendmakingenSuccess({
      documentId: id,
      data: bekendmakingenMock,
    });
    actual = bekendmakingenReducer(initialState, action);

    expect(actual.ids).toEqual(['NL.IMRO.plan-met-bekendmakingen']);
    expect(getStatus(actual)).toEqual('RESOLVED');
  });
});
