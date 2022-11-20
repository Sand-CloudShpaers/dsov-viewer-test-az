import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { of } from 'rxjs';
import { KaartenContainerComponent } from './kaarten-container.component';
import { DocumentenFacade } from '~viewer/documenten/+state/documenten.facade';
import { ApiSource } from '~model/internal/api-source';

describe('KaartenContainerComponent', () => {
  let spectator: Spectator<KaartenContainerComponent>;
  const spyOnApiSource$ = jasmine.createSpy('spyOnApiSource$').and.returnValue(of(ApiSource.OZON));

  const createComponent = createComponentFactory({
    component: KaartenContainerComponent,
    providers: [
      mockProvider(DocumentenFacade, {
        apiSource$: spyOnApiSource$,
      }),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent({ props: { documentId: 'document_met_kaarten' } });
    spectator.fixture.detectChanges();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
    expect(spyOnApiSource$).toHaveBeenCalledWith('document_met_kaarten');
  });
});
