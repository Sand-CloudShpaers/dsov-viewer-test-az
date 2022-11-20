import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { TestStore } from '~mocks/test-store';
import { State } from '~store/state';
import { ReleaseNotesComponent } from './release-notes.component';
import { VersionNumberService } from '~viewer/components/version-number/version-number.service';
import { versionNumberServiceMock } from '~viewer/components/version-number/version-number.component.spec';
import { DatePipe } from '@angular/common';
import { Release } from './types/release-notes.model';

describe('ReleaseNotesComponent', () => {
  let component: ReleaseNotesComponent;
  let fixture: ComponentFixture<ReleaseNotesComponent>;
  let store$: Store<State>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ReleaseNotesComponent],
      providers: [
        DatePipe,
        { provide: Store, useClass: TestStore },
        { provide: VersionNumberService, useValue: versionNumberServiceMock },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReleaseNotesComponent);
    component = fixture.componentInstance;
    store$ = TestBed.inject(Store);
    spyOn(store$, 'dispatch').and.stub();
    fixture.detectChanges();
  });

  describe('trackByFn', () => {
    it('should return the version of the release', () => {
      expect(component.trackByFn(123, { version: 'abc' } as any)).toBe('abc');
    });
  });

  describe('filterByVersionDate', () => {
    it('should retrurn true when the buildversiondate is greater or equal than this releasedate', () => {
      expect(component.filterByVersionDate({ date: '2021/1/27' } as any)).toBeTrue();
    });
  });

  describe('getHandleTitle', () => {
    it('should get title of handle', () => {
      expect(component.getHandleTitle({ version: 'x', date: '2022/10/28' } as Release)).toEqual('x - 28 oktober 2022');
    });
  });
});
