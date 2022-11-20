import { provideMockStore } from '@ngrx/store/testing';
import { NormenComponent } from './normen.component';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { OmgevingsnormenVM } from '~viewer/normen/types/omgevingsnormenVM';
import { MockComponent } from 'ng-mocks';
import { CollapsibleListComponent } from '~viewer/components/collapsible-list/collapsible-list.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NormType } from '~viewer/annotaties/types/annotaties-enums';
import { ApiSource } from '~model/internal/api-source';
import { SelectionObjectType } from '~store/common/selection/selection.model';
import { DocumentViewContext } from '~viewer/documenten/types/layout.model';

describe('NormenComponent', () => {
  let spectator: Spectator<NormenComponent>;

  const omgevingsnormenMock: OmgevingsnormenVM[] = [
    {
      identificatie: 'omgevingsnormen',
      naam: 'omgevingsnormen',
      normen: [
        {
          identificatie: 'schaap',
          naam: 'schaap',
          normType: NormType.OMGEVINGSNORMEN,
          normwaarden: [
            {
              identificatie: 'lam',
              naam: 'lam',
              representationLabel: 'lam',
              isOntwerp: false,
              isSelected: true,
            },
          ],
          eenheid: '',
          type: '',
        },
      ],
    },
  ];

  const omgevingsnormenMultipleMock: OmgevingsnormenVM[] = [
    {
      identificatie: 'omgevingsnormen',
      naam: 'omgevingsnormen',
      normen: [
        {
          identificatie: 'schaap',
          naam: 'schaap',
          normType: NormType.OMGEVINGSNORMEN,
          normwaarden: [
            {
              identificatie: 'schaap 1',
              naam: 'schaap 1',
              representationLabel: 'schaap 1',
              isOntwerp: false,
              isSelected: true,
            },
            {
              identificatie: 'schaap 2',
              naam: 'schaap 2',
              representationLabel: 'schaap 2',
              isOntwerp: false,
              isSelected: true,
            },
          ],
          eenheid: 'schaap-eenheden',
          type: '',
        },
      ],
    },
  ];

  const createComponent = createComponentFactory({
    component: NormenComponent,
    providers: [provideMockStore()],
    declarations: [MockComponent(CollapsibleListComponent)],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        omgevingsnormen: omgevingsnormenMock,
      },
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should show a list of normen', () => {
    expect(spectator.queryAll('dsov-collapsible-list').length).toEqual(1);
  });

  describe('getNormenGroepen', () => {
    it('should return undefined if no item is provided', () => {
      expect(spectator.component.getNormen(undefined)).toBeUndefined();
    });

    it('should return undefined if an item without normen is provided', () => {
      expect(spectator.component.getNormen({} as OmgevingsnormenVM)).toBeUndefined();
    });

    it('should return list with SelectableListVM array', () => {
      expect(spectator.component.getNormen(omgevingsnormenMock[0])).toEqual([
        {
          group: undefined,
          items: [
            {
              apiSource: ApiSource.OZON,
              labelPrefix: 'schaap: ',
              id: 'lam',
              parentId: 'schaap',
              parentName: 'schaap',
              name: 'lam',
              objectType: SelectionObjectType.OMGEVINGSNORM_NORMWAARDE,
              symboolcode: undefined,
              isSelected: true,
              isOntwerp: false,
            },
          ],
        },
      ]);
    });

    it('should return list with SelectableListVM array, grouped', () => {
      expect(spectator.component.getNormen(omgevingsnormenMultipleMock[0])).toEqual([
        {
          group: { naam: 'schaap (in schaap-eenheden)', apiSource: ApiSource.OZON, identificatie: 'schaap' },
          items: [
            {
              apiSource: ApiSource.OZON,
              id: 'schaap 1',
              parentId: 'schaap',
              parentName: 'schaap',
              name: 'schaap 1',
              labelPrefix: undefined,
              objectType: SelectionObjectType.OMGEVINGSNORM_NORMWAARDE,
              symboolcode: undefined,
              isSelected: true,
              isOntwerp: false,
            },
            {
              apiSource: ApiSource.OZON,
              id: 'schaap 2',
              parentId: 'schaap',
              parentName: 'schaap',
              name: 'schaap 2',
              labelPrefix: undefined,
              objectType: SelectionObjectType.OMGEVINGSNORM_NORMWAARDE,
              symboolcode: undefined,
              isSelected: true,
              isOntwerp: false,
            },
          ],
        },
      ]);
    });

    it('should return list with SelectableListVM array, grouped with symbol and sublabel at group level', () => {
      spectator.component.documentViewContext = DocumentViewContext.REGELS_OP_MAAT;

      expect(spectator.component.getNormen(omgevingsnormenMultipleMock[0])).toEqual([
        {
          group: {
            naam: 'schaap (in schaap-eenheden)',
            apiSource: ApiSource.OZON,
            identificatie: 'schaap',
            symboolcode: 'meerdere-waarden',
            subLabel: 'waarden worden weergegeven op de kaart',
          },
          items: [
            {
              apiSource: ApiSource.OZON,
              id: 'schaap 1',
              parentId: 'schaap',
              parentName: 'schaap',
              name: 'schaap 1',
              labelPrefix: 'op gekozen locatie: ',
              objectType: SelectionObjectType.OMGEVINGSNORM_NORMWAARDE,
              symboolcode: undefined,
              isSelected: true,
              isOntwerp: false,
            },
            {
              apiSource: ApiSource.OZON,
              id: 'schaap 2',
              parentId: 'schaap',
              parentName: 'schaap',
              name: 'schaap 2',
              labelPrefix: 'op gekozen locatie: ',
              objectType: SelectionObjectType.OMGEVINGSNORM_NORMWAARDE,
              symboolcode: undefined,
              isSelected: true,
              isOntwerp: false,
            },
          ],
        },
      ]);
    });
  });
});
