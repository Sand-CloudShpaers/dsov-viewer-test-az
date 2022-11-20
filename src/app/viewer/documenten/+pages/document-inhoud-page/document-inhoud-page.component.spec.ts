import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { DocumentInhoudPageComponent } from '~viewer/documenten/+pages/document-inhoud-page/document-inhoud-page.component';
import { DocumentenFacade } from '~viewer/documenten/+state/documenten.facade';
import { SelectionFacade } from '~store/common/selection/+state/selection.facade';

describe('DocumentInhoudPageComponent', () => {
  let spectator: Spectator<DocumentInhoudPageComponent>;
  const spyOnShowSelectionsOnMap = jasmine.createSpy('spyOnShowSelectionsOnMap');

  const createComponent = createComponentFactory({
    component: DocumentInhoudPageComponent,
    mocks: [],
    providers: [
      mockProvider(DocumentenFacade),
      mockProvider(SelectionFacade, { showSelectionsOnMap: spyOnShowSelectionsOnMap }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeDefined();
  });

  it('should show selection on map', () => {
    spectator.component.ngOnInit();

    expect(spyOnShowSelectionsOnMap).toHaveBeenCalled();
  });
});
