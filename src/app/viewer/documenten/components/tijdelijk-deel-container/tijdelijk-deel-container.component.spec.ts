import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { MockComponent } from 'ng-mocks';
import { TijdelijkDeelContainerComponent } from './tijdelijk-deel-container.component';
import { DocumentenFacade } from '~viewer/documenten/+state/documenten.facade';
import { of } from 'rxjs';
import { DocumentVM } from '~viewer/documenten/types/documenten.model';
import { ApiSource } from '~model/internal/api-source';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('TijdelijkDeelContainerComponent', () => {
  let spectator: Spectator<TijdelijkDeelContainerComponent>;
  const spyGetTijdelijkeDelen = jasmine.createSpy('getTijdelijkeDelen$');

  const tijdelijkDeelMock1: DocumentVM = {
    documentId: 'id_1',
    apiSource: ApiSource.OZON,
    subPages: [],
    title: 'Test deel 1',
    statusDateLine: '',
    bevoegdGezag: null,
    type: null,
  };
  const tijdelijkDeelMock2: DocumentVM = {
    documentId: 'id_2',
    apiSource: ApiSource.OZON,
    subPages: [],
    title: 'Test deel 2',
    statusDateLine: '',
    bevoegdGezag: null,
    type: null,
  };
  const tijdelijkeDelenMock: DocumentVM[] = [tijdelijkDeelMock1, tijdelijkDeelMock2];

  const createComponent = createComponentFactory({
    component: TijdelijkDeelContainerComponent,
    providers: [
      mockProvider(DocumentenFacade, {
        getTijdelijkeDelen$: spyGetTijdelijkeDelen,
      }),
    ],
    declarations: [MockComponent(TijdelijkDeelContainerComponent)],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        documentId: '/akn/test/id',
        documentType: 'Omgevingsverordening',
      },
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('Show tijdelijkeDelen', () => {
    expect(spectator.query('[role="alert"][data-test-id="tijdelijke-regelingsdeel-alert"]')).not.toExist();
    expect(spyGetTijdelijkeDelen).toHaveBeenCalledWith(spectator.component.documentId);

    spectator.component.heeftTijdelijkeDelen$ = of(tijdelijkeDelenMock);
    spectator.detectComponentChanges();

    expect(spectator.query('[role="alert"][data-test-id="tijdelijke-regelingsdeel-alert"]')).toExist();
    expect(spectator.queryAll('dsov-tijdelijk-deel').length).toEqual(2);
    expect(spectator.query('[data-test-id="tijdelijke-regelingsdeel__from-type"]')).toHaveText(
      'Uit omgevingsverordening'
    );
  });
});
