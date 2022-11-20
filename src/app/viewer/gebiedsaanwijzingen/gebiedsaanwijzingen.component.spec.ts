import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { MockComponent } from 'ng-mocks';
import { GebiedsaanwijzingenComponent } from './gebiedsaanwijzingen.component';
import { mockGebiedsaanwijzingenVM } from '~viewer/gebieds-info/+state/gebiedsaanwijzingen/gebiedsaanwijzingen.mock';
import { ConfigService } from '~services/config.service';
import { SelectionFacade } from '~store/common/selection/+state/selection.facade';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CollapsibleListComponent } from '~viewer/components/collapsible-list/collapsible-list.component';

describe('GebiedsaanwijzingenComponent', () => {
  let spectator: Spectator<GebiedsaanwijzingenComponent>;

  const createComponent = createComponentFactory({
    component: GebiedsaanwijzingenComponent,
    providers: [
      {
        provide: ConfigService,
        useValue: {
          config: {
            ozonVerbeelden: {
              url: 'url-tje',
              apiKey: 'bla',
            },
          },
        },
      },
      mockProvider(SelectionFacade),
    ],
    declarations: [MockComponent(GebiedsaanwijzingenComponent), MockComponent(CollapsibleListComponent)],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should have 1 gebiedsaanwijzing', () => {
    spectator.setInput({
      gebiedsaanwijzingen: [mockGebiedsaanwijzingenVM],
    });
    spectator.detectChanges();

    expect(spectator.queryAll('dsov-selectable-list').length).toEqual(1);
  });

  it('should set isInFilter = true in when gebiedsaanwijzingen is in filteroptions', () => {
    spectator.component.gebiedenInFilter = [
      {
        id: 'identificatie',
        name: 'naam',
      },
    ];

    const list = spectator.component.getSelectableList(mockGebiedsaanwijzingenVM);

    expect(list.items[0].isInFilter).toBeTrue();
  });
});
