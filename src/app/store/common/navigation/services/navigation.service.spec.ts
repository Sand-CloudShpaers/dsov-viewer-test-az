import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { provideMockStore } from '@ngrx/store/testing';
import { ViewerPage } from '~store/common/navigation/types/application-page';
import { NavigationService } from './navigation.service';

describe('NavigationService', () => {
  let spectator: SpectatorService<NavigationService>;

  const createService = createServiceFactory({
    service: NavigationService,
    imports: [RouterTestingModule],
    providers: [provideMockStore({})],
  });

  beforeEach(() => {
    spectator = createService();
  });

  it('should exist', () => {
    expect(spectator).toBeTruthy();
  });

  describe('routeLocationNavigationPath', () => {
    it('should navigate to page and preserve queryParams', () => {
      const router = TestBed.inject(Router);
      const navigateSpy = spyOn(router, 'navigate').and.stub();

      spectator.service.routeLocationNavigationPath(ViewerPage.GEBIEDEN);

      expect(navigateSpy).toHaveBeenCalledWith(['viewer/gebieden'], { queryParamsHandling: 'preserve' });
    });
  });
});
