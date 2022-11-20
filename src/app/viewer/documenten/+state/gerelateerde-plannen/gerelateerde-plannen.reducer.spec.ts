import {
  getStatus,
  initialState,
  reducer as gerelateerdePlannenReducer,
} from '~viewer/documenten/+state/gerelateerde-plannen/gerelateerde-plannen.reducer';
import {
  loadGerelateerdePlannenFailure,
  loadGerelateerdePlannenSuccess,
  loading,
} from '~viewer/documenten/+state/gerelateerde-plannen/gerelateerde-plannen.actions';
import { gerelateerdePlannenMock } from '~viewer/documenten/+state/gerelateerde-plannen/gerelateerde-plannen.selectors.spec';

const id = 'NL.IMRO.plan-met-relaties';

describe('gerelateerdePlannenReducer', () => {
  let actual;
  it('should have initial state', () => {
    const action = {};
    actual = gerelateerdePlannenReducer(undefined, action as any);

    expect(actual).toEqual(initialState);
  });

  it('should add gerelateerde-plannen with status PENDING', () => {
    const action = loading({
      documentId: id,
    });
    actual = gerelateerdePlannenReducer(initialState, action);

    expect(actual.entities['NL.IMRO.plan-met-relaties'].status).toEqual('PENDING');
  });

  it('should set status to REJECTED', () => {
    const action = loadGerelateerdePlannenFailure({
      documentId: id,
    });
    actual = gerelateerdePlannenReducer(initialState, action);

    expect(actual.entities['NL.IMRO.plan-met-relaties'].status).toEqual('REJECTED');
  });

  it('should add bekendmakingen on loadBekendmakingenSuccess', () => {
    const action = loadGerelateerdePlannenSuccess({
      documentId: id,
      entity: {
        gerelateerdePlannen: gerelateerdePlannenMock,
        gerelateerdVanuit: gerelateerdePlannenMock,
        dossier: [],
      },
    });
    actual = gerelateerdePlannenReducer(initialState, action);

    expect(actual.ids).toEqual(['NL.IMRO.plan-met-relaties']);
    expect(getStatus(actual)).toEqual('RESOLVED');
  });
});
