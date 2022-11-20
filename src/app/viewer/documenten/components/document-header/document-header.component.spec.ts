import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { DocumentHeaderComponent } from './document-header.component';
import { RouterTestingModule } from '@angular/router/testing';
import { PipesModule } from '~general/pipes/pipes.module';
import { SelectionFacade } from '~store/common/selection/+state/selection.facade';
import { DocumentenFacade } from '~viewer/documenten/+state/documenten.facade';
import { MockComponent } from 'ng-mocks';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Bestuurslaag, DocumentVM } from '~viewer/documenten/types/documenten.model';
import { ApiSource } from '~model/internal/api-source';
import { derivedLoadingState } from '~general/utils/store.utils';
import { LoadingState } from '~model/loading-state.enum';
import { of } from 'rxjs';

describe('DocumentHeaderComponent', () => {
  let spectator: Spectator<DocumentHeaderComponent>;
  const spyOnLoadDocumentLocatie = jasmine.createSpy('spyOnLoadDocumentLocatie');
  const spyOnLoadBekendmakingen = jasmine.createSpy('spyOnLoadBekendmakingen');

  const createComponent = createComponentFactory({
    component: DocumentHeaderComponent,
    imports: [RouterTestingModule, PipesModule],
    providers: [
      mockProvider(SelectionFacade),
      mockProvider(DocumentenFacade, {
        loadDocumentLocatie: spyOnLoadDocumentLocatie,
        loadIHRBekendmakingen: spyOnLoadBekendmakingen,
      }),
    ],
    declarations: [MockComponent(DocumentHeaderComponent)],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  const document: DocumentVM = {
    documentId: '/akn/nl/act/3',
    isOntwerp: false,
    apiSource: ApiSource.OZON,
    loadingState: derivedLoadingState(LoadingState.RESOLVED),
    subPages: [],
    hasDocumentStructure: true,
    identificatie: '/akn/nl/act/3',
    title: 'title',
    opschrift: 'opschrift',
    status: 'vastgesteld',
    type: 'type',
    statusDateLine: '',
    bevoegdGezag: {
      bestuurslaag: Bestuurslaag.RIJK,
      code: '0000',
      naam: 'beleidsmatigVerantwoordelijkeOverheid',
    },
    inwerkingVanaf: new Date('1-1-2020'),
    geldigVanaf: new Date('1-1-2020'),
    isHistorisch: false,
    locationHref: 'href',
    extent: undefined,
  };

  const input = { document };

  beforeEach(() => {
    spectator = createComponent({ props: input });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should show load bekendmakingen', () => {
    spectator.component.ngOnInit();

    expect(spyOnLoadDocumentLocatie).toHaveBeenCalledWith(document.documentId, document.locationHref);
  });

  it('should toggle all features', () => {
    spectator.setInput({
      ...input,
    });
    spectator.component.toggleFeatures();
    spectator.detectComponentChanges();

    expect(spectator.component.showAllFeatures).toEqual(true);
    expect(spectator.queryAll('[data-test-id="summary__show-more-button"]')[0]).toHaveText('minder kenmerken');

    spectator.component.toggleFeatures();
    spectator.detectComponentChanges();

    expect(spectator.component.showAllFeatures).toEqual(false);
    expect(spectator.queryAll('[data-test-id="summary__show-more-button"]')[0]).toHaveText('meer kenmerken');
  });

  it('should show opschrift', () => {
    spectator.setInput({
      ...input,
    });
    spectator.component.toggleFeatures();
    spectator.detectComponentChanges();

    expect(spectator.query('[data-test-id="summary__full-description__opschrift"]')).toHaveText('opschrift');
  });

  it('should show publicatie link', () => {
    spectator.setInput({
      ...input,
      document: {
        ...document,
        apiSource: ApiSource.OZON,
        publicatie: 'http://',
      },
    });
    spectator.component.toggleFeatures();
    spectator.detectComponentChanges();

    expect(spectator.query('[data-test-id="summary__full-description__publicatie-link"]')).toExist();
  });

  it('should show procedurestappen', () => {
    spectator.setInput({
      ...input,
      document: {
        ...document,
        ozonOntwerpbesluitId: '1234',
        procedurestappen: [
          {
            soortStap: {
              code: 'code',
              waarde: 'Publicatie',
            },
            voltooidOp: new Date('2020-01-01'),
          },
        ],
      },
    });
    spectator.component.toggleFeatures();
    spectator.detectComponentChanges();

    expect(spectator.query('[data-test-id="summary__full-description__ozonOntwerpPublicatie"]')).toExist();
  });

  it('should show summary__date geldigVanafDate', () => {
    spectator.setInput({
      ...input,
      document: {
        ...document,
        statusDateLine: 'Geldig vanaf 01-01-2020',
      },
    });
    spectator.detectComponentChanges();

    expect(spectator.query('[data-test-id="summary__short-description__date"]')).toHaveText('Geldig vanaf 01-01-2020');
  });

  it('should show IHR summary__date geldigVanafDate', () => {
    spectator.setInput({
      ...input,
      document: {
        ...document,
        statusDateLine: 'vastgesteld 01-01-2020',
      },
    });
    spectator.detectComponentChanges();

    expect(spectator.query('[data-test-id="summary__short-description__date"]')).toHaveText('vastgesteld 01-01-2020');
  });

  it('should show summary__short-description__documentType', () => {
    spectator.setInput({
      ...input,
      document: {
        ...document,
        inwerkingVanaf: null,
        type: 'Bestemmingsplan',
        geldigVanaf: new Date('1-1-2020'),
      },
    });
    spectator.detectComponentChanges();

    expect(spectator.query('[data-test-id="summary__short-description__documentType"]')).toHaveText('Bestemmingsplan');
  });

  it('should show badge -Ontwerp', () => {
    spectator.setInput({
      ...input,
      document: {
        ...document,
        isOntwerp: true,
      },
    });
    spectator.detectComponentChanges();

    expect(spectator.query('[data-test-id="summary__badge-ontwerp"]')).toHaveText('Ontwerp');
  });

  it('should show badge validity warning when plan is historisch', () => {
    spectator.setInput({
      ...input,
      document: {
        ...document,
        apiSource: ApiSource.IHR,
        isHistorisch: true,
      },
    });
    spectator.detectComponentChanges();

    expect(spectator.query('[data-test-id="summary__badge-validatie"]')).toHaveText(
      'Historisch plan – niet meer geldig.'
    );
  });

  it('should show badge validity warning when plan is verwijderd', () => {
    spectator.setInput({
      ...input,
      document: {
        ...document,
        apiSource: ApiSource.IHR,
        isVerwijderdOp: '2020-01-01',
      },
    });
    spectator.detectComponentChanges();

    expect(spectator.query('[data-test-id="summary__badge-validatie"]')).toHaveText('Plan is verwijderd.');
  });

  it('should load bekendmakingen', () => {
    spectator.setInput({
      ...input,
      document: {
        ...document,
        apiSource: ApiSource.IHR,
      },
    });
    spectator.component.ngOnInit();

    expect(spyOnLoadBekendmakingen).toHaveBeenCalled();
  });

  it('should show bekendmakingen', () => {
    spectator.component.bekendmakingen$ = of([
      {
        href: 'href',
        titel: 'bekendmaking',
        documentType: 'documentType',
      },
    ]);
    spectator.component.showAllFeatures = true;
    spectator.detectComponentChanges();

    expect(spectator.query('[data-test-id="summary__full-description__bekendmaking-link"]')).toHaveText('bekendmaking');
  });
});
