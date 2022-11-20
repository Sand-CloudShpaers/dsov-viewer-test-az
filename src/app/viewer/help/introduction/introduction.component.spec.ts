import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IntroductionComponent } from './introduction.component';
import { CmsContentModule } from '~viewer/help/cms-content/cms-content.module';
import { HelpModalModule } from '../help-modal/help-modal.module';
import { IntroductionService } from './introduction.service';
import { of } from 'rxjs';

describe('IntroductionComponent', () => {
  let component: IntroductionComponent;
  let fixture: ComponentFixture<IntroductionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CmsContentModule, HelpModalModule, HelpModalModule.forRoot()],
      declarations: [IntroductionComponent],
      providers: [
        {
          provide: IntroductionService,
          useValue: {
            fetchIntroduction$: () => of('introduction'),
          },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntroductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
