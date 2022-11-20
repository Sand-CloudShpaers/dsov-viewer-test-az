import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { CmsContentComponent } from './cms-content.component';

describe('cmsContentComponent => ', () => {
  let component: CmsContentComponent;
  let fixture: ComponentFixture<CmsContentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [CmsContentComponent],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CmsContentComponent);
        component = fixture.componentInstance;
      });
  }));

  it('compile the thing', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });
});
