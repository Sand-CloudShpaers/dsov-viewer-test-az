import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { ContactinfoComponent } from './contactinfo.component';
import { CmsContentModule } from '~viewer/help/cms-content/cms-content.module';
import { ContactinfoService } from './contactinfo.service';
import { of } from 'rxjs';
import { HelpModalModule } from '../help-modal/help-modal.module';

describe('contactinfoComponent => ', () => {
  let component: ContactinfoComponent, fixture: ComponentFixture<ContactinfoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, CmsContentModule, HelpModalModule.forRoot()],
      declarations: [ContactinfoComponent],
      providers: [{ provide: ContactinfoService, useValue: { fetchContactinfo$: () => of('testString') } as any }],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ContactinfoComponent);
        component = fixture.componentInstance;
      });
  }));

  it('compile the thing', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });
});
