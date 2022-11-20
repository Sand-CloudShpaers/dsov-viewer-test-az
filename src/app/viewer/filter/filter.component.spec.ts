import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { mockProvider } from '@ngneat/spectator';
import { SearchFacade } from '~viewer/search/+state/search.facade';
import { FilterFacade } from './filter.facade';
import { FilterComponent } from './filter.component';
import { of } from 'rxjs';
import { FilterName } from './types/filter-options';

describe('filterComponent test', () => {
  let component: FilterComponent;
  let fixture: ComponentFixture<FilterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule],
      declarations: [FilterComponent],
      providers: [mockProvider(FilterFacade), mockProvider(SearchFacade)],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterComponent);
    component = fixture.componentInstance;
    component.filterOptions$ = of({
      [FilterName.ACTIVITEIT]: [],
      [FilterName.GEBIEDEN]: [],
      [FilterName.DOCUMENTEN]: [],
      [FilterName.THEMA]: [],
      [FilterName.DOCUMENT_TYPE]: [],
      [FilterName.REGELGEVING_TYPE]: [],
      [FilterName.REGELSBELEID]: [],
      [FilterName.DATUM]: [],
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
