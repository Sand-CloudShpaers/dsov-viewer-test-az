import { GerelateerdePlannenContainerComponent } from './gerelateerde-plannen-container.component';
import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { DocumentenFacade } from '~viewer/documenten/+state/documenten.facade';
import { of } from 'rxjs';
import { gerelateerdePlannenDocumentVMMock } from '~viewer/documenten/+state/gerelateerde-plannen/gerelateerde-plannen.selectors.spec';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { documentDtoMock } from '~viewer/documenten/types/documentDto.mock';

describe('GerelateerdePlannenContainerComponent', () => {
  let spectator: Spectator<GerelateerdePlannenContainerComponent>;

  const createComponent = createComponentFactory({
    component: GerelateerdePlannenContainerComponent,
    providers: [mockProvider(DocumentenFacade)],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        document: documentDtoMock,
      },
    });
    spectator.detectComponentChanges();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should show spinner component', () => {
    spectator.component.status$ = of({
      isLoading: true,
      isIdle: false,
      isPending: true,
      isResolved: false,
      isRejected: false,
      isLoaded: false,
    });
    spectator.detectComponentChanges();

    expect(spectator.query('dsov-spinner')).toExist();
  });

  it('should include gerelateerdeplannen component for Dossier, Gerelateerd and GerelateerdVanuit', () => {
    spectator.component.dossierPlannen$ = of(gerelateerdePlannenDocumentVMMock);
    spectator.component.gerelateerdePlannen$ = of(gerelateerdePlannenDocumentVMMock);
    spectator.component.gerelateerdVanuit$ = of(gerelateerdePlannenDocumentVMMock);

    spectator.component.status$ = of({
      isLoading: false,
      isIdle: false,
      isPending: false,
      isResolved: true,
      isRejected: false,
      isLoaded: true,
    });
    spectator.fixture.detectChanges();

    const gerelateerdComponents = spectator.queryAll('dsov-gerelateerde-plannen');

    expect(gerelateerdComponents.length).toEqual(3);
    expect(gerelateerdComponents[0].getAttribute('data-test-id')).toEqual('gerelateerde-plannen__dossier');
    expect(gerelateerdComponents[1].getAttribute('data-test-id')).toEqual('gerelateerde-plannen__gerelateerd');
    expect(gerelateerdComponents[2].getAttribute('data-test-id')).toEqual('gerelateerde-plannen__vanuit');
  });

  it('should show info alert when no dossier and no related plans are present', () => {
    spectator.component.dossierPlannen$ = of(undefined);
    spectator.component.gerelateerdePlannen$ = of([]);
    spectator.component.gerelateerdVanuit$ = of([]);

    spectator.component.status$ = of({
      isLoading: false,
      isIdle: false,
      isPending: false,
      isResolved: true,
      isRejected: false,
      isLoaded: true,
    });
    spectator.fixture.detectChanges();

    expect(spectator.queryAll('dso-alert[data-test-id="alert-geen-plandossier"]').length).toEqual(1);
  });
});
