import { inject, TestBed } from '@angular/core/testing';

import { IntroductionService } from './introduction.service';
import { CmsHttpClient } from '~http/cms.http-client';
import { of } from 'rxjs';
import { ConfigService } from '~services/config.service';

describe('IntroductionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        IntroductionService,
        {
          provide: CmsHttpClient,
          useValue: {
            get$: of('introduction test'),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            config: {
              cmsAlgemeneUitleg: {
                url: 'https://blaat.schaap',
              },
            },
          },
        },
      ],
    });
  });

  it('should be created', inject([IntroductionService], (service: IntroductionService) => {
    expect(service).toBeTruthy();
  }));
});
