import { DocumentGerelateerdPageComponent } from './document-gerelateerd-page.component';
import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { DocumentenFacade } from '~viewer/documenten/+state/documenten.facade';
import { SelectionFacade } from '~store/common/selection/+state/selection.facade';

describe('DocumentGerelateerdPageComponent', () => {
  let spectator: Spectator<DocumentGerelateerdPageComponent>;
  const spyOnShowSelectionsOnMap = jasmine.createSpy('spyOnShowSelectionsOnMap');

  const createComponent = createComponentFactory({
    component: DocumentGerelateerdPageComponent,
    providers: [
      mockProvider(DocumentenFacade),
      mockProvider(SelectionFacade, { showSelectionsOnMap: spyOnShowSelectionsOnMap }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    spectator.fixture.detectChanges();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should show selection on map', () => {
    spectator.component.ngOnInit();

    expect(spyOnShowSelectionsOnMap).toHaveBeenCalled();
  });
});
