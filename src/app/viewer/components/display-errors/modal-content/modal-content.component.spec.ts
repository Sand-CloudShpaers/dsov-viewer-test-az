import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { ModalContentComponent } from './modal-content.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('test ModalContentComponent', () => {
  let fixture: ComponentFixture<ModalContentComponent>;
  let comp: ModalContentComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [ModalContentComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ModalContentComponent);
        comp = fixture.componentInstance;
      });
  }));

  it('should be able to create', () => {
    expect(comp).toBeTruthy();
  });
});
