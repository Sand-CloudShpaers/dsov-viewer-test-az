import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilterName } from '~viewer/filter/types/filter-options';
import { FilterValueComponent } from './filter-value.component';

describe('SingleSelectFilterComponent', () => {
  let component: FilterValueComponent;
  let fixture: ComponentFixture<FilterValueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FilterValueComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterValueComponent);
    component = fixture.componentInstance;
    component.filterOptions = {
      activiteit: [],
      thema: [{ id: 'thema_a', name: 'Thema A' }],
      document_type: [],
      regelgeving_type: [],
      regelsbeleid: [],
      gebieden: [],
      documenten: [],
      datum: [],
    };
    component.filterName = FilterName.THEMA;
    component.filterItems = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component.currentFilterValues).toEqual([{ id: 'thema_a', name: 'Thema A' }]);
  });

  describe('equals', () => {
    it('should return true', () => {
      expect(component.equals({ id: 'a', name: 'A' }, { id: 'a', name: 'A' })).toBeTrue();
    });

    it('should return false', () => {
      expect(component.equals({ id: 'a', name: 'A' }, undefined)).toBeFalse();
      expect(component.equals(undefined, { id: 'a', name: 'A' })).toBeFalse();
      expect(component.equals({ id: 'A', name: 'A' }, { id: 'a', name: 'A' })).toBeFalse();
    });
  });

  describe('onChange', () => {
    it('should emit in singleSelect', () => {
      spyOn(component.filterSelected, 'emit');
      const item = { id: 'thema_a', name: 'Thema A' };
      component.singleSelect = true;
      component.onChange(item);

      expect(component.filterSelected.emit).toHaveBeenCalledWith({ thema: [item] });
    });

    it('should emit in multiSelect', () => {
      spyOn(component.filterSelected, 'emit');
      component.currentFilterValues = [];
      const item = { id: 'thema_a', name: 'Thema A' };
      component.singleSelect = false;
      component.onChange(item, { target: { checked: true } } as unknown as Event);

      expect(component.filterSelected.emit).toHaveBeenCalledWith({ thema: [item] });
    });
  });

  describe('toggleShowFilters', () => {
    it('should return inverse value', () => {
      expect(component.showFilters).toBeTrue();
      component.toggleShowFilters();

      expect(component.showFilters).toBeFalse();
    });
  });

  describe('trackByFilterItem', () => {
    it('should return id of filterIdentification', () => {
      expect(component.trackByFilterItem(0, { id: 'x', name: 'X' })).toEqual('x');
    });
  });
});
