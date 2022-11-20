import { KaartenOzonComponent } from './kaarten-ozon.component';
import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { DocumentenFacade } from '~viewer/documenten/+state/documenten.facade';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { derivedLoadingState } from '~general/utils/store.utils';
import { LoadingState } from '~model/loading-state.enum';
import { kaartVMMocks } from '~viewer/documenten/+state/kaarten/kaarten.mock';

describe('KaartenOzonComponent', () => {
  let spectator: Spectator<KaartenOzonComponent>;
  const spyOnloadKaarten = jasmine.createSpy('spyOnloadKaarten');

  const createComponent = createComponentFactory({
    component: KaartenOzonComponent,
    providers: [
      mockProvider(DocumentenFacade, {
        loadKaarten: spyOnloadKaarten,
      }),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });
  beforeEach(() => {
    spectator = createComponent({
      props: { documentId: 'documentId' },
    });
    spectator.fixture.detectChanges();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
    expect(spyOnloadKaarten).toHaveBeenCalledWith('documentId');
  });

  it('should show dsov-kaarten', () => {
    spectator.component.kaartenStatus$ = of(derivedLoadingState(LoadingState.RESOLVED));
    spectator.component.kaarten$ = of(kaartVMMocks);
    spectator.fixture.detectChanges();

    expect(spectator.query('dsov-kaarten')).toExist();
  });

  it('should show alert when loading rejected', () => {
    spectator.component.kaartenStatus$ = of(derivedLoadingState(LoadingState.REJECTED));
    spectator.fixture.detectChanges();

    expect(spectator.query('.alert-danger').innerHTML).toEqual('Kaarten ophalen niet gelukt.');
  });

  it('should show message when kaarten are loading', () => {
    spectator.component.kaartenStatus$ = of(derivedLoadingState(LoadingState.PENDING));
    spectator.fixture.detectChanges();

    expect(spectator.query('dsov-spinner')).toExist();
  });

  it('should show alert when no kaarten present', () => {
    spectator.component.kaartenStatus$ = of(derivedLoadingState(LoadingState.RESOLVED));
    spectator.component.kaarten$ = of([]);
    spectator.fixture.detectChanges();

    expect(spectator.query('[data-test-id="alert-no-maps"]')).toExist();
    expect(spectator.query('[data-test-id="alert-no-maps"]').innerHTML).toEqual(
      ' Dit document bevat geen interactieve kaarten. '
    );
  });
});
