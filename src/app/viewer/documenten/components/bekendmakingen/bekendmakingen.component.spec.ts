import { BekendmakingenComponent } from './bekendmakingen.component';
import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { DocumentenFacade } from '~viewer/documenten/+state/documenten.facade';

import { bekendmakingenMock } from '~viewer/documenten/+state/bekendmakingen/bekendmakingen.selectors.spec';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('DocumentBekendmakingenComponent', () => {
  let spectator: Spectator<BekendmakingenComponent>;

  const createComponent = createComponentFactory({
    component: BekendmakingenComponent,
    providers: [mockProvider(DocumentenFacade)],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    spectator.setInput({
      bekendmakingen: bekendmakingenMock.bekendmakingen,
    });
    spectator.fixture.detectChanges();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should show bekendmakingen', () => {
    const titel = spectator.queryAll('.bekendmakingen__titel-header-item');
    const bekendmakingen = spectator.queryAll('.bekendmakingen__list__item');

    expect(titel[0].innerHTML).toEqual('Bekendmakingen');
    expect(bekendmakingen.length).toEqual(2);
  });

  it('should show bekendmakingen no titel and no bekendmakingen', () => {
    spectator.setInput({
      bekendmakingen: [],
    });

    spectator.fixture.detectChanges();
    const titel = spectator.queryAll('.bekendmakingen__titel-header-item');
    const bekendmakingen = spectator.queryAll('.bekendmakingen__list__item');

    expect(titel.length).toEqual(0);
    expect(bekendmakingen.length).toEqual(0);
  });
});
