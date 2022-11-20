import { BestemmingsplanFeaturesComponent } from './bestemmingsplan-features.component';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { ApiSource } from '~model/internal/api-source';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BestemmingsplanFeatureGroupVMMocks } from '~viewer/annotaties/+state/bestemminsplan-features/bestemmingsplan-features.mock';

const featureGroup = BestemmingsplanFeatureGroupVMMocks[0];

describe('BestemmingsplanFeaturesComponent', () => {
  let spectator: Spectator<BestemmingsplanFeaturesComponent>;

  const createComponent = createComponentFactory({
    component: BestemmingsplanFeaturesComponent,
    providers: [],
    declarations: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        featureGroup,
        documentId: 'documentId',
        annotationId: {
          identificatie: 'tekstId',
          elementId: 'tekstId',
        },
      },
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  describe('getIsExpanded', () => {
    it('should return true', () => {
      expect(spectator.component.isExpanded()).toBeTrue();
    });
  });

  describe('getSelectableList', () => {
    it('should return a [SelectableListItemVM]', () => {
      expect(spectator.component.getSelectableList()).toEqual([
        {
          items: [
            {
              id: featureGroup.features[0].id,
              elementId: 'tekstId',
              documentDto: {
                documentId: 'documentId',
              },
              name: 'Leuke bestemmingsvlak',
              objectType: featureGroup.objectType,
              apiSource: ApiSource.IHR,
              isSelected: featureGroup.features[0].isSelected,
              symboolcode: featureGroup.features[0].symboolcode,
              locatieIds: featureGroup.features[0].locatieIds,
            },
          ],
        },
      ]);
    });
  });
});
