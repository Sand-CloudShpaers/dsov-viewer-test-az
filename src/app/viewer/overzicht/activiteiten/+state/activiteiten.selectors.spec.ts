import * as fromSelectors from './activiteiten.selectors';
import { ActiviteitenGroepVM } from '~viewer/gebieds-info/types/gebieds-info.model';
import { mockActiviteiten, mockActiviteitenGroepVM } from './activiteiten.mock';
import { LoadingState } from '~model/loading-state.enum';
import { State } from '~store/state';

const activiteitenGroupVM: ActiviteitenGroepVM = mockActiviteitenGroepVM;

describe('Activiteiten Selectors', () => {
  it('selectActiviteitenGroepen', () => {
    expect(
      fromSelectors.selectActiviteitenGroepen({
        activiteiten: { data: mockActiviteiten, status: LoadingState.RESOLVED },
      } as State)
    ).toEqual([activiteitenGroupVM]);
  });
});
