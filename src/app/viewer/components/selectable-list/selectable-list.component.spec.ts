import { createRoutingFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { SelectableListComponent } from './selectable-list.component';
import { SelectionFacade } from '~store/common/selection/+state/selection.facade';
import { provideMockStore } from '@ngrx/store/testing';
import initialState from '~mocks/initial-state';
import { ApiSource } from '~model/internal/api-source';
import { SelectableListModule } from './selectable-list.module';
import { HighlightFacade } from '~store/common/highlight/+state/highlight.facade';
import { SelectionObjectType } from '~store/common/selection/selection.model';
import { SelectableListItemVM } from './types/selectable-list-item';

const selectableListItemMocks: SelectableListItemVM[] = [
  {
    id: 'varen op de Noordzee',
    documentDto: {
      documentId: 'documentId',
    },
    objectType: SelectionObjectType.WERKINGSGEBIED,
    apiSource: ApiSource.OZON,
    isSelected: true,
    name: 'varen',
    isOntwerp: false,
  },
  {
    id: 'lopen op het strand',
    documentDto: {
      documentId: 'documentId',
    },
    objectType: SelectionObjectType.WERKINGSGEBIED,
    apiSource: ApiSource.OZON,
    isSelected: true,
    name: 'lopen',
    isOntwerp: false,
  },
];

describe('SelectableListComponent', () => {
  let spectator: Spectator<SelectableListComponent>;
  const spyOn_addSelections = jasmine.createSpy('spyOn_addSelections');
  const spyOn_removeSelections = jasmine.createSpy('spyOn_removeSelections');
  const spyOn_cancelHighlight = jasmine.createSpy('spyOn_cancelHighlight');
  const spyOn_startHighlight = jasmine.createSpy('spyOn_startHighlight');

  const createComponent = createRoutingFactory({
    component: SelectableListComponent,
    imports: [SelectableListModule],
    providers: [
      provideMockStore({ initialState }),
      mockProvider(SelectionFacade, {
        addSelections: spyOn_addSelections,
        removeSelections: spyOn_removeSelections,
      }),
      mockProvider(HighlightFacade, {
        startHighlight: spyOn_startHighlight,
        cancelHighlight: spyOn_cancelHighlight,
      }),
    ],
    declarations: [],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        list: {
          items: [],
        },
        showCheckboxes: true,
        showSliders: true,
      },
    });
    spectator.detectComponentChanges();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should call start highlight after onHighlight with event', () => {
    spectator.component.onHighlight([selectableListItemMocks[0]], true);

    expect(spyOn_startHighlight).toHaveBeenCalledWith({
      id: 'varen op de Noordzee',
      selections: [
        {
          id: 'varen op de Noordzee',
          objectType: SelectionObjectType.WERKINGSGEBIED,
          documentDto: {
            documentId: 'documentId',
          },
          apiSource: ApiSource.OZON,
          isOntwerp: false,
          isSelected: true,
          name: 'varen',
        },
      ],
      apiSource: 'OZON',
    });
  });

  it('should call start highlight after onHighlight with event, with multiple selections', () => {
    spectator.component.onHighlight(selectableListItemMocks, true);

    expect(spyOn_startHighlight).toHaveBeenCalledWith({
      id: 'varen op de Noordzee, lopen op het strand',
      selections: [
        {
          id: 'varen op de Noordzee',
          objectType: SelectionObjectType.WERKINGSGEBIED,
          documentDto: {
            documentId: 'documentId',
          },
          apiSource: 'OZON',
          isOntwerp: false,
          isSelected: true,
          name: 'varen',
        },
        {
          id: 'lopen op het strand',
          objectType: SelectionObjectType.WERKINGSGEBIED,
          documentDto: {
            documentId: 'documentId',
          },
          apiSource: 'OZON',
          isOntwerp: false,
          isSelected: true,
          name: 'lopen',
        },
      ],
      apiSource: 'OZON',
    });
  });

  it('should call cancel highlight after onHighlight without event', () => {
    spectator.component.onHighlight([selectableListItemMocks[0]], false);

    expect(spyOn_cancelHighlight).toHaveBeenCalled();
  });

  it('should not showSlider when list item is inFilter', () => {
    spectator.component.showSliders = true;
    spectator.component.list = {
      items: [{ ...selectableListItemMocks[0], isInFilter: true }],
    };
    spectator.detectChanges();

    expect(spectator.component.showSlider('varen op de Noordzee')).toBeFalse();
  });

  it('should not showSlider when list is grouped', () => {
    spectator.component.showSliders = true;
    spectator.component.list = {
      group: {
        naam: 'groep',
        identificatie: 'groep',
        apiSource: ApiSource.OZON,
      },
      items: selectableListItemMocks,
    };
    spectator.detectChanges();

    expect(spectator.component.showSlider('varen op de Noordzee')).toBeFalse();
  });

  it('should set add to selections', () => {
    spectator.component.onSelectionChange(
      [
        {
          id: 'kaartlaag',
          documentDto: {
            documentId: 'documentId',
          },
          name: 'kaartlaag.naam',
          apiSource: ApiSource.OZON,
          objectType: SelectionObjectType.KAART_KAARTLAAG,
          niveau: 1,
          isSelected: true,
          isOntwerp: false,
        },
      ],
      true
    );

    expect(spyOn_addSelections).toHaveBeenCalledWith([
      {
        id: 'kaartlaag',
        documentDto: { documentId: 'documentId' },
        name: 'kaartlaag.naam',
        apiSource: ApiSource.OZON,
        objectType: SelectionObjectType.KAART_KAARTLAAG,
        niveau: 1,
        isSelected: true,
        isOntwerp: false,
      },
    ]);
  });

  it('should set add to selections, IHR', () => {
    spectator.component.onSelectionChange(
      [
        {
          id: 'bestemmingsvlak',
          documentDto: {
            documentId: 'NL.IMRO',
          },
          name: 'bestemmingsvlak',
          apiSource: ApiSource.IHR,
          objectType: SelectionObjectType.BESTEMMINGSVLAK,
          isSelected: true,
          symboolcode: 'bestemmingsvlak_code',
          locatieIds: ['bestemmingsvlak'],
        },
      ],
      true
    );

    expect(spyOn_addSelections).toHaveBeenCalledWith([
      {
        id: 'bestemmingsvlak',
        documentDto: { documentId: 'NL.IMRO' },
        name: 'bestemmingsvlak',
        apiSource: ApiSource.IHR,
        objectType: SelectionObjectType.BESTEMMINGSVLAK,
        isSelected: true,
        symboolcode: 'bestemmingsvlak_code',
        locatieIds: ['bestemmingsvlak'],
      },
    ]);
  });

  it('should show grouped list', () => {
    spectator.component.showSliders = true;
    spectator.component.list = {
      group: {
        naam: 'groep',
        identificatie: 'groep',
        apiSource: ApiSource.OZON,
      },
      items: selectableListItemMocks,
    };
    spectator.detectComponentChanges();

    expect(spectator.query('[data-test-id="selectable-list-item-grouped"]')).toExist();
  });
});
