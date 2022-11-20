import { RouterTestingModule } from '@angular/router/testing';
import { InhoudIhrComponent } from './inhoud-ihr.component';
import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { DocumentenFacade } from '~viewer/documenten/+state/documenten.facade';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { inhoudMock } from '~viewer/documenten/+state/inhoud/inhoud.selectors.spec';

describe('InhoudIhrComponent', () => {
  let spectator: Spectator<InhoudIhrComponent>;

  const createComponent = createComponentFactory({
    component: InhoudIhrComponent,
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
    spectator.component.inhoud$ = of(inhoudMock);
    spectator.component.bekendmakingen$ = of([]);
    spectator.detectComponentChanges();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should show inhoud', () => {
    const inhoudEls = spectator.queryAll('[data-test-id="document-inhoud__onderdeel"]');

    expect(inhoudEls.length).toEqual(3);
  });

  it('should show verwijzingNaarVaststellingsbesluit', () => {
    const inhoudEls = spectator.queryAll('[data-test-id="document-inhoud__verwijzingNaarVaststellingsbesluit"]');

    expect(inhoudEls.length).toEqual(1);
  });

  it('should show empty message', () => {
    spectator.component.inhoud$ = of(undefined);
    spectator.detectComponentChanges();
    const message = spectator.query('[data-test-id="document-inhoud__empty"]');

    expect(message).toExist();
  });
});
