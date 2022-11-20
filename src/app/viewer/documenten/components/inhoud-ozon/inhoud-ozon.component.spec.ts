import { RouterTestingModule } from '@angular/router/testing';
import { InhoudOzonComponent } from './inhoud-ozon.component';
import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { DocumentenFacade } from '~viewer/documenten/+state/documenten.facade';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('InhoudOzonComponent', () => {
  let spectator: Spectator<InhoudOzonComponent>;

  const createComponent = createComponentFactory({
    component: InhoudOzonComponent,
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

  it('should has hoofdlijnen', () => {
    expect(
      spectator.component.hasHoofdlijnen({ groep: [{ identificatie: 'id', naam: 'naam', soort: 'soort' }] })
    ).toBeTrue();
  });

  it('should has NOT hoofdlijnen', () => {
    expect(spectator.component.hasHoofdlijnen({})).toBeFalse();
  });
});
