import { RouterTestingModule } from '@angular/router/testing';
import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { of } from 'rxjs';
import { ActiviteitenListContainerComponent } from './activiteiten-list-container.component';
import { ActiviteitenFacade } from '~viewer/overzicht/activiteiten/+state/activiteiten.facade';
import { SelectionFacade } from '~store/common/selection/+state/selection.facade';

describe('ActiviteitenListContainerComponent', () => {
  let spectator: Spectator<ActiviteitenListContainerComponent>;
  const spyOnLoadActiviteiten = jasmine.createSpy('spyOnLoadActiviteiten');

  const createComponent = createComponentFactory({
    imports: [RouterTestingModule],
    component: ActiviteitenListContainerComponent,
    providers: [
      mockProvider(ActiviteitenFacade, { getActiviteitenGroepen$: of([]), loadActiviteiten: spyOnLoadActiviteiten }),
      mockProvider(SelectionFacade),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should load activiteiten', () => {
    spectator.component.ngOnInit();

    expect(spyOnLoadActiviteiten).toHaveBeenCalled();
  });
});
