import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { DocumentenFacade } from '~viewer/documenten/+state/documenten.facade';
import { DocumentToelichtingPageComponent } from './document-toelichting-page.component';

describe('DocumentBijlagenPageComponent', () => {
  let spectator: Spectator<DocumentToelichtingPageComponent>;

  const createComponent = createComponentFactory({
    component: DocumentToelichtingPageComponent,
    mocks: [DocumentenFacade],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeDefined();
  });
});
