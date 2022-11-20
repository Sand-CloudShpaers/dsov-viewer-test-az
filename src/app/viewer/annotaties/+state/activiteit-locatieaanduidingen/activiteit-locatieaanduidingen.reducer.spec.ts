import {
  initialState,
  reducer as activiteitLocatieaanduidingenReducer,
} from './activiteit-locatieaanduidingen.reducer';
import {
  mockActiviteitLocatieaanduidingenEntity,
  mockActiviteitLocatieaanduidingenResponse,
} from '~viewer/annotaties/+state/activiteit-locatieaanduidingen/activiteit-locatieaanduidingen.mock';
import * as fromActiviteitLocatieaanduidingen from './activiteit-locatieaanduidingen.actions';

describe('activiteitReducer', () => {
  it('should have initial state', () => {
    const action = {};
    const actual = activiteitLocatieaanduidingenReducer(undefined, action as any);

    expect(actual).toEqual(initialState);
  });

  it('should add results on loadSuccess', () => {
    const action = fromActiviteitLocatieaanduidingen.loadSuccess(mockActiviteitLocatieaanduidingenEntity);
    const actual = activiteitLocatieaanduidingenReducer(initialState, action);

    expect(actual.entities.regeltekstId.data.vastgesteld).toEqual(mockActiviteitLocatieaanduidingenResponse);

    expect(actual.entities.regeltekstId.data.annotationId).toEqual({
      identificatie: 'regeltekstId',
      elementId: 'elementId',
    });
  });
});
