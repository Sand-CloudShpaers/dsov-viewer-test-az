import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { MockComponent } from 'ng-mocks';
import { ZoomToPlanComponent } from './zoom-to-plan.component';
import { KaartService } from '~viewer/kaart/services/kaart.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('ZoomToPlanComponent', () => {
  let spectator: Spectator<ZoomToPlanComponent>;
  const spyOnZoomToExtent = jasmine.createSpy('spyOnZoomToExtent');

  const createComponent = createComponentFactory({
    component: ZoomToPlanComponent,
    providers: [
      mockProvider(KaartService, {
        zoomToExtent: spyOnZoomToExtent,
      }),
    ],
    declarations: [MockComponent(ZoomToPlanComponent)],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  const input = {
    documentId: '/akn/nl/act/3',
    extent: [1, 2, 7, 8],
    shouldZoom: true,
  };

  beforeEach(() => {
    spectator = createComponent();
    spectator.setInput(input);
    spectator.detectChanges();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should zoom to gebied initial', done => {
    spectator.component.ngOnChanges();

    // eslint-disable-next-line jasmine/new-line-before-expect
    setTimeout(() => {
      expect(spyOnZoomToExtent).toHaveBeenCalledWith([1, 2, 7, 8]);
      done();
    }, 200);
  });

  it('should zoom to gebied with method', done => {
    spectator.component.zoomToGebiedExtent();

    // eslint-disable-next-line jasmine/new-line-before-expect
    setTimeout(() => {
      expect(spyOnZoomToExtent).toHaveBeenCalledWith([1, 2, 7, 8]);
      done();
    }, 200);
  });
});
