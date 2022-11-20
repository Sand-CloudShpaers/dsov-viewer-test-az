import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';
import * as PlannenActions from '~viewer/filtered-results/+state/plannen/plannen.actions';
import * as FilterActions from '~viewer/filter/+state/filter.actions';
import { PlannenEffects } from './plannen.effect';
import { FilterName } from '~viewer/filter/types/filter-options';

describe('PlannenEffects', () => {
  let spectator: SpectatorService<PlannenEffects>;
  let actions$: Observable<Action>;

  const createService = createServiceFactory({
    service: PlannenEffects,
    providers: [provideMockActions(() => actions$)],
    mocks: [],
  });

  beforeEach(() => {
    spectator = createService();
  });

  describe('updateFilters', () => {
    it('should set dirty', done => {
      actions$ = of(FilterActions.UpdateFiltersSuccess({ filterOptions: { [FilterName.LOCATIE]: [] }, commands: [] }));

      spectator.service.updateFilterSuccess$.subscribe(actual => {
        const expected = PlannenActions.reset();

        expect(actual).toEqual(expected);
        done();
      });
    });
  });

  describe('removeFilters', () => {
    it('should set dirty', done => {
      actions$ = of(FilterActions.RemoveFilter);

      spectator.service.removeFilter$.subscribe(actual => {
        const expected = PlannenActions.reset();

        expect(actual).toEqual(expected);
        done();
      });
    });
  });

  describe('resetFilters', () => {
    it('should set dirty', done => {
      actions$ = of(FilterActions.ResetFilters({ filterNames: [FilterName.LOCATIE] }));

      spectator.service.resetFilters$.subscribe(actual => {
        const expected = PlannenActions.reset();

        expect(actual).toEqual(expected);
        done();
      });
    });
  });

  describe('isDirty', () => {
    it('should set not dirty', done => {
      actions$ = of(PlannenActions.reset());

      spectator.service.isDirty$.subscribe(actual => {
        const expected = PlannenActions.setNotDirty();

        expect(actual).toEqual(expected);
        done();
      });
    });
  });
});
