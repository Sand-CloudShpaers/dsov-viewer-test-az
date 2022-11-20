import { RouterTestingModule } from '@angular/router/testing';
import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { FilterFacade } from '~viewer/filter/filter.facade';
import { ActiviteitenPageComponent } from './activiteiten-page.component';
import { NavigationService } from '~store/common/navigation/services/navigation.service';
import { ActivatedRoute } from '@angular/router';
import { OzonLocatiesFacade } from '~store/common/ozon-locaties/+state/ozon-locaties.facade';
import { ViewerPage } from '~store/common/navigation/types/application-page';
import { FilteredResultsFacade } from '~viewer/filtered-results/+state/filtered-results.facade';

describe('ActiviteitenPageComponent', () => {
  let spectator: Spectator<ActiviteitenPageComponent>;
  const spyOnRouteLocationNavigationPath = jasmine.createSpy('spyOnRouteLocationNavigationPath');

  const createComponent = createComponentFactory({
    imports: [RouterTestingModule],
    component: ActiviteitenPageComponent,
    providers: [
      mockProvider(FilteredResultsFacade),
      mockProvider(OzonLocatiesFacade),
      mockProvider(FilterFacade),
      mockProvider(NavigationService, {
        routeLocationNavigationPath: spyOnRouteLocationNavigationPath,
      }),
      {
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            queryParams: {},
          },
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should go to previous page', () => {
    spectator.component.previousPage();

    expect(spyOnRouteLocationNavigationPath).toHaveBeenCalledWith(ViewerPage.OVERZICHT);
  });
});
