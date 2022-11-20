import { SearchComponent } from './search.component';
import { LocatieFilterService } from '~viewer/filter/services/locatie-filter.service';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { BehaviorSubject } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { SearchMode } from '~viewer/search/types/search-mode';
import { SearchFacade } from '~viewer/search/+state/search.facade';

describe('SearchComponent', () => {
  let spectator: Spectator<SearchComponent>;
  const mockSearchStatus$ = new BehaviorSubject<any>({});
  const resetStateSpy = jasmine.createSpy('resetState');
  const spyOnResetSearchMode = jasmine.createSpy('spyOnResetSearchMode');
  const spyOn_suggestLocation = jasmine.createSpy('spyOn_suggestLocation');

  const createComponent = createComponentFactory({
    component: SearchComponent,
    imports: [RouterTestingModule],
    providers: [
      {
        provide: LocatieFilterService,
        useValue: {
          resetState: resetStateSpy,
          searchStatus$: mockSearchStatus$,
          suggestLocation: spyOn_suggestLocation,
        },
      },
      {
        provide: SearchFacade,
        useValue: {
          setSearchMode: spyOnResetSearchMode,
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    spectator.fixture.detectChanges();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  // TODO 11-5-2022 Uitzoeken hoe we met de searchstatus omgaan
  it('should display label for correct status', () => {
    mockSearchStatus$.next({ loading: true });
    spectator.detectChanges();

    expect(spectator.query('dsov-spinner')).toHaveAttribute({ label: 'Een moment geduld alstublieft.' });

    mockSearchStatus$.next({ error: 'fout' });
    spectator.detectChanges();

    expect(spectator.query('.alert-warning')).toHaveText('fout');
  });

  describe('trackBy', () => {
    it('should return id of item', () => {
      expect(spectator.component.trackBy(0, 'abc')).toEqual('abc');
    });
  });

  describe('select', () => {
    it('should select searchModes', () => {
      const component = spectator.fixture.componentInstance;

      spectator.component.select(SearchMode.LOCATIE);
      spectator.fixture.detectChanges();

      expect(spyOnResetSearchMode).toHaveBeenCalledWith(SearchMode.LOCATIE);
      expect(spyOn_suggestLocation).toHaveBeenCalled();
      expect(component.selectedMode).toEqual(SearchMode.LOCATIE);
    });
  });
});
