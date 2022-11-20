import { Title } from '@angular/platform-browser';
import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { ApplicationTitle } from '~store/common/navigation/types/application-page';
import { FilterLocationComponent } from './filter-location.component';

describe('FilterActiveLocationComponent', () => {
  let spectator: Spectator<FilterLocationComponent>;
  const spyOnSetTitle = jasmine.createSpy('setTitle');

  const createComponent = createComponentFactory({
    component: FilterLocationComponent,
    providers: [
      mockProvider(Title, {
        setTitle: spyOnSetTitle,
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    spectator.setInput({
      locatieFilter: {
        id: 'locatie',
        name: 'locatie',
        geometry: null,
      },
      page: 'Overzicht',
    });
    spectator.fixture.detectChanges();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should set title', () => {
    spectator.component.ngOnInit();

    expect(spyOnSetTitle).toHaveBeenCalledWith(`locatie: Overzicht - ${ApplicationTitle}`);
  });
});
