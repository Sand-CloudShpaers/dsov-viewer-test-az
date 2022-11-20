import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { DocumentenFacade } from '~viewer/documenten/+state/documenten.facade';
import { DocumentObjectinformationPageComponent } from '~viewer/documenten/+pages/document-objectinformatie-page/document-objectinformation-page.component';
import { KaartService } from '~viewer/kaart/services/kaart.service';
import { KaartServiceMock } from '~viewer/kaart/services/kaart.service.mock';
import { BehaviorSubject } from 'rxjs';
import { FeatureLike } from 'ol/Feature';

describe('DocumentObjectinformationPageComponent', () => {
  let spectator: Spectator<DocumentObjectinformationPageComponent>;

  const createComponent = createComponentFactory({
    component: DocumentObjectinformationPageComponent,
    mocks: [],
    providers: [mockProvider(DocumentenFacade), { provide: KaartService, useClass: KaartServiceMock }],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeDefined();
  });

  it('should reset featuresAtLocation, on destroy', () => {
    spectator.component.ngOnDestroy();

    expect(spectator.component.kaartService.featuresAtLocation).toEqual(
      new BehaviorSubject<FeatureLike[]>([{} as FeatureLike])
    );
  });

  it('should return kaartFeatures array', () => {
    expect(spectator.component.kaartFeatures$).toHaveLength(1);
  });
});
