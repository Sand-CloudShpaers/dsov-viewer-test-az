import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { TestStore } from '~mocks/test-store';
import { State } from '~store/state';
import { closeOverlay, showApplicationInfo } from '~viewer/overlay/+state/overlay.actions';
import { VersionNumberComponent } from './version-number.component';
import { VersionNumberService } from './version-number.service';

export const versionNumberServiceMock = {
  getBuildVersion: () => '123 2021-03-08T08:00:00Z',
  getBuildVersionNumber: () => '123',
  getBuildVersionDate: () => new Date('2021-03-08T08:00:00Z'),
  loadVersion: () => of('123 2021-03-08T08:00:00Z'),
};

describe('test VersionNumberComponent', () => {
  let component: VersionNumberComponent;
  let fixture: ComponentFixture<VersionNumberComponent>;
  let store$: Store<State>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [VersionNumberComponent],
      providers: [
        { provide: VersionNumberService, useValue: versionNumberServiceMock },
        { provide: Store, useClass: TestStore },
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(VersionNumberComponent);
        component = fixture.componentInstance;
        store$ = TestBed.inject(Store);
        spyOn(store$, 'dispatch').and.stub();
        fixture.detectChanges();
      });
  }));

  it('should get Version and VersionNr from service', () => {
    component.ngOnInit();

    expect(component.versionNr).toEqual('123');
  });

  describe('showApplicationInfo', () => {
    it('should dispatch closeOverlay and showApplicationInfo', () => {
      component.showApplicationInfo();

      expect(store$.dispatch).toHaveBeenCalledWith(closeOverlay());
      expect(store$.dispatch).toHaveBeenCalledWith(showApplicationInfo());
    });
  });
});
