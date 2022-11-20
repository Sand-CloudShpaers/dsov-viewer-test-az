import { KaartenListImroComponent } from './kaarten-list-imro.component';
import { MapDetailsFacade } from '~viewer/documenten/+state/map-details.facade';
import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { mapDetailsVMMockBP } from '~viewer/documenten/+state/map-details/map-details.mock';
import { ApiSource } from '~model/internal/api-source';
import { SelectionFacade } from '~store/common/selection/+state/selection.facade';

describe('IhrKaartenListComponent', () => {
  let spectator: Spectator<KaartenListImroComponent>;

  const spyOnShowMapDetails = jasmine.createSpy('spyOnFetchDispatchDeployParameters');

  const createComponent = createComponentFactory({
    component: KaartenListImroComponent,
    providers: [
      mockProvider(MapDetailsFacade, {
        showMapDetails: spyOnShowMapDetails,
      }),
      mockProvider(SelectionFacade, {}),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(async () => {
    spectator = createComponent({
      props: {
        planId: 'documentId',
        mapDetails: mapDetailsVMMockBP,
      },
    });
    spectator.detectComponentChanges();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  describe('toggleLayer', () => {
    it('should turn off one layer', () => {
      spectator.component.mapDetails = mapDetailsVMMockBP;
      const details = mapDetailsVMMockBP.map(item => item.details).flat();
      spectator.component.toggleLayer({ item: details[0], checked: false, groupKey: 1 });

      // Expect selection to contain all elements except the one set to false
      expect(spyOnShowMapDetails.calls.mostRecent().args[0].length).toEqual(details.length - 1);
    });
  });

  describe('toggleGroup', () => {
    it('should turn off all layers (in the group) and turn them on again', () => {
      spectator.component.mapDetails = mapDetailsVMMockBP;
      const details = mapDetailsVMMockBP.map(item => item.details).flat();
      spectator.component.toggleGroup(1);

      // Expect selection to be empty as all elements should be set to selected = false
      expect(spyOnShowMapDetails).toHaveBeenCalledWith([], spectator.component.planId);

      spectator.component.toggleGroup(1);

      // Expect selection to contain all elements except the one set to false
      expect(spyOnShowMapDetails.calls.mostRecent().args[0].length).toEqual(details.length);
    });
  });

  describe('showOnMap', () => {
    it('should call showOnMap', () => {
      spyOn(spectator.component, 'showOnMap');
      spectator.component.mapDetails = mapDetailsVMMockBP;
      const details = mapDetailsVMMockBP.map(item => item.details).flat();
      spectator.component.toggleLayer({ item: details[0], checked: true, groupKey: 1 });

      expect(spectator.component.showOnMap).toHaveBeenCalled();
    });
  });

  describe('trackBy', () => {
    it('trackByListItem should return the label of the listitem', () => {
      expect(
        spectator.component.trackByListItem(123, {
          apiSource: ApiSource.IHR,
          id: '123',
          name: 'naam',
          isSelected: true,
        })
      ).toBe('123');
    });

    it('trackByCartografie should return the naam of the kaart', () => {
      expect(
        spectator.component.trackByCartografie(123, {
          naam: 'kaart',
          nummer: 1,
          details: [],
        })
      ).toBe('kaart');
    });

    it('trackByObjectInfo should return the naam of the detail', () => {
      expect(
        spectator.component.trackByObjectInfo(123, {
          id: '123',
          naam: 'wonen',
          type: 'EnkelBestemming',
          symboolcode: 'enkelbestemming_wonen',
          selected: true,
        })
      ).toBe('wonen');
    });
  });

  it('trackByIndex should return the index', () => {
    expect(spectator.component.trackByGroup(123)).toBe(123);
  });
});
