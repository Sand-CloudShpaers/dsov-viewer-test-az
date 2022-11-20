import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { StoreModule } from '@ngrx/store';
import { reducers, runtimeChecks } from '~store/state';
import { LayerSwitcherComponent } from './layer-switcher.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { KaartService } from '~viewer/kaart/services/kaart.service';
import { KaartServiceMock } from '~viewer/kaart/services/kaart.service.mock';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('LayerSwitcherComponent', () => {
  let component: LayerSwitcherComponent;
  let fixture: ComponentFixture<LayerSwitcherComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        StoreModule.forRoot(reducers, { runtimeChecks }),
        MatSliderModule,
        HttpClientTestingModule,
      ],
      declarations: [LayerSwitcherComponent],
      providers: [{ provide: KaartService, useClass: KaartServiceMock }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(LayerSwitcherComponent);
        component = fixture.componentInstance;
        component.layers = [];
      });
  }));

  beforeEach(() => {
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
