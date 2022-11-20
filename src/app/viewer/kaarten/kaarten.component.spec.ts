import { RouterTestingModule } from '@angular/router/testing';
import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { SelectionFacade } from '~store/common/selection/+state/selection.facade';
import { KaartenComponent } from './kaarten.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MockComponent } from 'ng-mocks';
import { CollapsibleListComponent } from '~viewer/components/collapsible-list/collapsible-list.component';
import { kaartVMMocks, kaartVMMocks02 } from '~viewer/documenten/+state/kaarten/kaarten.mock';
import { SelectableListVM } from '~viewer/components/selectable-list/types/selectable-list-item';

describe('KaartenComponent', () => {
  let spectator: Spectator<KaartenComponent>;

  const createComponent = createComponentFactory({
    component: KaartenComponent,
    imports: [RouterTestingModule],
    providers: [mockProvider(SelectionFacade)],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    declarations: [MockComponent(KaartenComponent), MockComponent(CollapsibleListComponent)],
  });

  beforeEach(() => {
    spectator = createComponent();

    spectator.setInput({
      kaarten: kaartVMMocks,
    });
    spectator.fixture.detectChanges();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should have 2 kaarten', () => {
    expect(spectator.queryAll('dsov-collapsible-list').length).toEqual(2);
  });

  it('should sort kaartlagen', () => {
    const lagen: SelectableListVM[] = spectator.component.getKaartLagen(kaartVMMocks02[2]);

    expect(lagen[0].items[0].niveau).toBe(3);
    expect(lagen[0].items[1].niveau).toBe(2);
    expect(lagen[0].items[2].niveau).toBe(1);
  });
});
