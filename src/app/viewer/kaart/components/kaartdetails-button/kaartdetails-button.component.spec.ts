import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KaartdetailsButtonComponent } from './kaartdetails-button.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('KaartdetailsButtonComponent', () => {
  let component: KaartdetailsButtonComponent;
  let fixture: ComponentFixture<KaartdetailsButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KaartdetailsButtonComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KaartdetailsButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('showKaartdetails', () => {
    it('should call next on eventEmitter', () => {
      spyOn(component.showMapPanel, 'next');
      component.showKaartdetails();

      expect(component.showMapPanel.next).toHaveBeenCalled();
    });
  });
});
