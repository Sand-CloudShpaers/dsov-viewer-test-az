import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IhrDisabledComponent } from './ihr-disabled.component';

describe('IhrDisabledComponent', () => {
  let component: IhrDisabledComponent;
  let fixture: ComponentFixture<IhrDisabledComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IhrDisabledComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IhrDisabledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
