import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { derivedLoadingState } from '~general/utils/store.utils';
import { ApplicationInfoComponent } from './application-info.component';
import { ApplicationInfoFacade } from '../application-info.facade';
import { LoadingState } from '~model/loading-state.enum';
import { ApplicationInfo } from '~store/common/application-info/types/application-info';
import { VersionNumberService } from '~viewer/components/version-number/version-number.service';

describe('ApplicationInfoComponent', () => {
  let spectator: Spectator<ApplicationInfoComponent>;
  const spyOnGetApplicationInfo = jasmine.createSpy('spyOnGetApplicationInfo');

  const mockApplicationInfo: ApplicationInfo[] = [
    {
      version: '6.3.1',
      name: 'OZON Presenteren API',
      models: [
        {
          version: '2.0.0',
          name: 'CIMOW',
        },
        {
          version: '1.1.0',
          name: 'STOP',
        },
      ],
    },
    {
      version: 'v4',
      name: 'Ruimtelijke Plannen API',
    },
  ];

  const createComponent = createComponentFactory({
    component: ApplicationInfoComponent,
    providers: [
      mockProvider(VersionNumberService),
      mockProvider(ApplicationInfoFacade, { getApplicationInfo: spyOnGetApplicationInfo }),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent({ detectChanges: false });
    spectator.component.status$ = of(derivedLoadingState(LoadingState.RESOLVED));
    spectator.component.applicationInfo$ = of(mockApplicationInfo);
    spectator.detectComponentChanges();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should load application info', () => {
    spectator.component.ngAfterViewInit();

    expect(spyOnGetApplicationInfo).toHaveBeenCalled();
  });
});
