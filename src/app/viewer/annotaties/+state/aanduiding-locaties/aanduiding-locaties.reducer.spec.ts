import {
  initialState,
  reducer as aanduidingsLocatiesReducer,
} from '~viewer/annotaties/+state/aanduiding-locaties/aanduiding-locaties.reducer';
import * as fromAanduidingLocaties from '~viewer/annotaties/+state/aanduiding-locaties/aanduiding-locaties.actions';
import { LoadingState } from '~model/loading-state.enum';
import { mockAanduidingLocaties } from '~viewer/overzicht/activiteiten/+state/activiteiten.mock';

describe('aanduidingLocatiesReducer', () => {
  it('should have initial state', () => {
    const action = {};
    const actual = aanduidingsLocatiesReducer(undefined, action as any);

    expect(actual).toEqual(initialState);
  });

  it('should add results on loadSuccess', () => {
    const action = fromAanduidingLocaties.loadSuccess(mockAanduidingLocaties);
    const actual = aanduidingsLocatiesReducer(initialState, action);

    expect(actual.entities).toEqual({
      ['activiteitId/activiteitlocatieaanduidingen/activiteitLocatieaanduidingId']: {
        data: mockAanduidingLocaties,
        entityId: 'activiteitId/activiteitlocatieaanduidingen/activiteitLocatieaanduidingId',
        status: LoadingState.RESOLVED,
      },
    });
  });
});
