import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { CmsHttpClient } from '~http/cms.http-client';
import { ConfigService } from '~services/config.service';
import { ContactinfoModule } from './contactinfo/contactinfo.module';
import { HelpModalModule } from './help-modal/help-modal.module';
import { HelpComponent } from './help.component';
import { IntroductionModule } from './introduction/introduction.module';

describe('HelpComponent', () => {
  let component: HelpComponent;
  let fixture: ComponentFixture<HelpComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HelpModalModule.forRoot(), ContactinfoModule, IntroductionModule],
      declarations: [HelpComponent],
      providers: [
        {
          provide: CmsHttpClient,
          useValue: {
            get$: () => of([]),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            config: {
              cmsAlgemeneUitleg: {
                url: 'https://blaat.schaap',
              },
              cmsContact: {
                url: 'https://blaat.schaap',
              },
              cmsVragenAntwoorden: {
                url: 'https://blaat.schaap',
              },
            },
          },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
