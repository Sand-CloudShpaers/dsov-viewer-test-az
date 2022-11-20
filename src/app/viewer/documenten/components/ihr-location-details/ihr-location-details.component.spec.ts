import { IhrLocationDetailsComponent } from './ihr-location-details.component';
import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { MapDetailsFacade } from '~viewer/documenten/+state/map-details.facade';
import { fakeAsync, tick } from '@angular/core/testing';

describe('IhrLocationDetailsContainerComponent', () => {
  let spectator: Spectator<IhrLocationDetailsComponent>;
  const spyOnLoadCartografie = jasmine.createSpy('spyOnLoadCartografie');
  const planId = 'planId';
  const createComponent = createComponentFactory({
    component: IhrLocationDetailsComponent,
    mocks: [],
    imports: [],
    providers: [
      mockProvider(MapDetailsFacade, {
        loadCartografie: spyOnLoadCartografie,
      }),
    ],
    declarations: [],
  });

  beforeEach(async () => {
    spectator = createComponent({
      props: {
        planId,
        features: [],
      },
    });
    spectator.detectComponentChanges();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should detect changes with features', fakeAsync(() => {
    const featureProps = {
      categorie: 'c',
      classificatie: 'waarde',
      naam: 'n',
      layer: 'planobject_polygon',
      objectid: 'o',
      planid: 'p',
      type: 'Dubbelbestemming',
    };
    const features = [
      {
        getProperties: () => featureProps,
      },
      {
        getProperties: () => featureProps,
      },
    ] as any;
    spectator.setInput({ features });
    spectator.detectComponentChanges();
    tick(400);

    expect(spyOnLoadCartografie).toHaveBeenCalledWith(planId, features);
  }));

  it('should show warning when no features found', fakeAsync(() => {
    const features = [] as any;
    spectator.setInput(features);
    spectator.detectComponentChanges();
    tick(400);

    expect(spectator.query('[data-test-id="dso-objectinformatie__warning"]')).toHaveLength(1);
  }));

  describe('trackByListItem', () => {
    it('should return the objectId of the listitem', () => {
      expect(spectator.component.trackByKeys(123, 'key')).toBe('key');
    });
  });
});
