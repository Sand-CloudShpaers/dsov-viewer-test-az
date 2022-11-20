import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WijzigingenComponent } from './wijzigingen.component';
import { Store } from '@ngrx/store';
import { TestStore } from '~mocks/test-store';

describe('WijzigingenComponent', () => {
  let component: WijzigingenComponent;
  let fixture: ComponentFixture<WijzigingenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WijzigingenComponent],
      providers: [{ provide: Store, useClass: TestStore }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WijzigingenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
