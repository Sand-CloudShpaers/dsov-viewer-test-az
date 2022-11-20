import { LocatiesComponent } from './locaties.component';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import * as fromAnnotationMocks from '~viewer/annotaties/mocks/annotaties.mocks';
import { MockComponent } from 'ng-mocks';
import { ApiSource } from '~model/internal/api-source';
import { SelectableListVM } from '~viewer/components/selectable-list/types/selectable-list-item';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SelectionObjectType } from '~store/common/selection/selection.model';

describe('LocatiesComponent', () => {
  let spectator: Spectator<LocatiesComponent>;
  const createComponent = createComponentFactory({
    component: LocatiesComponent,
    declarations: [MockComponent(LocatiesComponent)],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        locaties: fromAnnotationMocks.locatiesVMMock,
        annotationId: {
          identificatie: 'regeltekstId',
          elementId: 'elementId',
        },
      },
    });
    spectator.fixture.detectChanges();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should have 1 group of "locaties"', () => {
    expect(spectator.queryAll('dsov-selectable-list').length).toEqual(1);
  });

  describe('getLocatiesAsSelectableListItemVMs', () => {
    it('should return correct SelectableListItemVMs', () => {
      const expectedSelectableListItemVM: SelectableListVM = {
        items: [
          {
            id: 'identificatie',
            regeltekstIdentificatie: 'regeltekstId',
            regeltekstTechnischId: undefined,
            name: 'naam',
            objectType: SelectionObjectType.WERKINGSGEBIED,
            apiSource: ApiSource.OZON,
            symboolcode: undefined,
            isSelected: true,
            isOntwerp: false,
          },
        ],
      };

      expect(spectator.component.getLocaties(fromAnnotationMocks.locatiesVMMock)).toEqual(expectedSelectableListItemVM);
    });
  });

  describe('trackByFn', () => {
    it('return locatie identificatie', () => {
      expect(spectator.component.trackByFn(0, fromAnnotationMocks.locatiesVMMock[0])).toEqual('identificatie');
    });
  });
});
