import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePickerContainerComponent } from './date-picker-container.component';

describe('DatePickerContainerComponent', () => {
  let component: DatePickerContainerComponent;
  let fixture: ComponentFixture<DatePickerContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DatePickerContainerComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatePickerContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('setDetail', () => {
    beforeEach(() => {
      spyOn(component, 'handleInput');
    });

    it('should not handleInput', () => {
      component.setDetail({ detail: { error: 'invalid' } } as unknown as Event);

      expect(component.showError).toBeFalse();
      expect(component.detail).toEqual({ error: 'invalid' } as any);
      expect(component.handleInput).not.toHaveBeenCalled();
    });

    it('should handleInput', () => {
      component.setDetail({ detail: { value: 'dd-MM-YYYY' } } as unknown as Event);

      expect(component.handleInput).toHaveBeenCalled();
    });
  });

  describe('handleInput', () => {
    beforeEach(() => {
      spyOn(component.dateChanged, 'emit');
    });

    it('should do nothing', () => {
      component.handleInput();

      expect(component.showError).toBeFalse();
      expect(component.errorMessage).toBeFalsy();
      expect(component.dateChanged.emit).not.toHaveBeenCalled();
    });

    it('should show error message for invalid date', () => {
      component.detail = { error: 'invalid' } as any;
      component.handleInput();

      expect(component.showError).toBeTrue();
      expect(component.errorMessage).toEqual('Vul de datum in met de juiste notatie (dd-mm-jjjj).');
      expect(component.dateChanged.emit).toHaveBeenCalledWith({ error: 'invalid' } as any);
    });

    it('should show error message for date before min date', () => {
      const valueAsDate = new Date(1939, 8, 1);
      const min = new Date(1945, 3, 30);
      const error = 'min-range';
      component.min = min;
      component.detail = { valueAsDate, error } as any;
      component.handleInput();

      expect(component.showError).toBeTrue();
      expect(component.errorMessage).toEqual('De datum ligt voor 30-04-1945. Vul een datum in op of na 30-04-1945.');

      expect(component.dateChanged.emit).toHaveBeenCalledWith({
        error,
        valueAsDate,
      } as any);
    });

    it('should show error message for date after max date', () => {
      const valueAsDate = new Date(Date.parse('1945-08-06'));
      const max = new Date(Date.parse('1945-04-30'));
      const error = 'max-range';
      component.max = max;
      component.detail = { valueAsDate, error } as any;
      component.handleInput();

      expect(component.showError).toBeTrue();
      expect(component.errorMessage).toEqual('De datum ligt na 30-04-1945. Vul een datum in voor of op 30-04-1945.');

      expect(component.dateChanged.emit).toHaveBeenCalledWith({
        error,
        valueAsDate,
      } as any);
    });

    it('should not show error message', () => {
      component.min = new Date(Date.parse('1945-08-06'));
      component.max = new Date(Date.parse('1945-08-09'));
      component.detail = { valueAsDate: new Date(Date.parse('1945-08-07')), value: '07-08-1945' } as any;
      component.handleInput();

      expect(component.showError).toBeFalse();
      expect(component.errorMessage).toBeFalsy();

      expect(component.dateChanged.emit).toHaveBeenCalledWith(component.detail);
    });
  });
});
