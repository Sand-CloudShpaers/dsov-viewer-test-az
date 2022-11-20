import { RouterTestingModule } from '@angular/router/testing';
import { InhoudContainerComponent } from './inhoud-container.component';
import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { DocumentenFacade } from '~viewer/documenten/+state/documenten.facade';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('InhoudContainerComponent', () => {
  let spectator: Spectator<InhoudContainerComponent>;

  const createComponent = createComponentFactory({
    component: InhoudContainerComponent,
    imports: [RouterTestingModule],
    providers: [mockProvider(DocumentenFacade)],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        document: { documentId: 'NL.IMRO' },
      },
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
