import { AnnotatiesComponent } from './annotaties.component';
import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { of } from 'rxjs';
import { AnnotatiesFacade } from '~viewer/annotaties/+state/annotaties.facade';
import { DocumentenFacade } from '~viewer/documenten/+state/documenten.facade';
import { SelectionFacade } from '~store/common/selection/+state/selection.facade';
import { annotatieHoofdlijnenVMMock } from '~viewer/annotaties/+state/hoofdlijnen/hoofdlijnen.mock';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AnnotationVM } from '~viewer/documenten/types/annotation';
import { locatiesVMMock } from '~viewer/annotaties/mocks/annotaties.mocks';
import { DerivedLoadingState } from '~general/utils/store.utils';
import { activiteitLocatieaanduidingenGroepVM } from '~viewer/overzicht/activiteiten/+state/activiteiten.mock';
import { FilterName } from '~viewer/filter/types/filter-options';
import { DocumentBodyElement } from '~viewer/documenten/types/documenten.model';
import { DocumentElementenLayoutVM, DocumentViewContext } from '~viewer/documenten/types/layout.model';
import { ApiSource } from '~model/internal/api-source';
import { NavigationFacade } from '~store/common/navigation/+state/navigation.facade';
import { mockAnnotationId } from '~viewer/annotaties/+state/idealisatie/idealisatie.reducer.spec';

describe('AnnotatiesComponent', () => {
  let spectator: Spectator<AnnotatiesComponent>;
  const spyOnGetLocatiesById = jasmine.createSpy('spyOnGetLocatiesById');
  const spyOnGetAnnotationStatusById = jasmine.createSpy('spyOnGetactiviteitLocatieaanduidingenStatusById');

  const annotationMock: AnnotationVM = {
    annotationId: {
      identificatie: 'regeltekstId',
      elementId: 'elementId',
    },
    typeRegelgeving: 'Instructieregel voor besluit geldelijke regelingen',
    themas: [{ identificatie: '1', naam: 'thema' }],
    vastgesteld: {
      activiteitenHref: '',
      omgevingswaardenHref: '',
      omgevingsnormenHref: '',
      gebiedsaanwijzingenHref: '',
      locatiesHref: '',
      hoofdlijnenHref: '',
      features: [],
    },
  };

  const layoutMock: DocumentElementenLayoutVM = {
    documentViewContext: DocumentViewContext.VOLLEDIG_DOCUMENT,
    showContent: true,
    showElementen: false,
    isCollapsible: true,
    showToggle: true,
    showNumberOnly: false,
    showTitle: true,
    isFiltered: false,
    isOpen: true,
    showAnnotation: false,
    hasAnnotation: true,
    isEmptyParagraph: false,
    isActive: false,
    showBreadcrumbs: false,
  };

  const elementMock: DocumentBodyElement = {
    id: 'id',
    documentId: 'documentId',
    layout: layoutMock,
    hasChildren: false,
    apiSource: ApiSource.OZON,
    breadcrumbs: [],
    isOntwerp: false,
    isGereserveerd: false,
    isVervallen: false,
  };

  const createComponent = createComponentFactory({
    component: AnnotatiesComponent,
    providers: [
      mockProvider(AnnotatiesFacade, {
        getLocatiesById$: spyOnGetLocatiesById,
        getAnnotatiesStatusById$: spyOnGetAnnotationStatusById,
      }),
      mockProvider(DocumentenFacade),
      mockProvider(SelectionFacade),
      mockProvider(NavigationFacade),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  const derivedLoadinState: DerivedLoadingState = {
    isLoading: false,
    isIdle: false,
    isPending: false,
    isResolved: true,
    isRejected: false,
    isLoaded: true,
  };

  beforeEach(() => {
    spectator = createComponent({
      detectChanges: false,
      props: {
        annotation: annotationMock,
        element: elementMock,
        showAnnotation: true,
      },
    });
    spectator.component.idealisatie$ = of(true);
    spectator.component.hoofdlijnen$ = of([annotatieHoofdlijnenVMMock]);
    spectator.component.locaties$ = of(locatiesVMMock);
    spectator.component.annotatiesStatus$ = of(derivedLoadinState);
    spectator.component.activiteitLocatieaanduidingen$ = of([activiteitLocatieaanduidingenGroepVM]);
    spectator.component.gebiedsaanwijzingen$ = of([]);
    spectator.component.filterOptions = {
      [FilterName.GEBIEDEN]: [],
    };
    spectator.detectComponentChanges();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should show themas', () => {
    expect(spectator.query('[data-test-id="annotaties-themas"]')).toExist();
    expect(spectator.query('[data-test-id="annotaties-themas__waarde"]').innerHTML).toEqual('thema');
  });

  it('should show idealisatie', () => {
    expect(spectator.query('[data-test-id="annotaties-idealisatie__label"]').innerHTML).toEqual('Hardheid begrenzing');
    expect(spectator.query('[data-test-id="annotaties-idealisatie__waarde"]').innerHTML).toEqual('indicatief');
  });

  it('should show hoofdlijnen', () => {
    expect(spectator.query('[data-test-id="annotaties-hoofdlijnen"]')).toExist();
  });

  it('should show locaties', () => {
    expect(spectator.query('[data-test-id="annotaties-locaties"]')).toExist();
  });

  it('should show activiteiten', () => {
    expect(spectator.query('dsov-activiteiten')).toExist();
  });

  it('should NOT show activiteiten', () => {
    spectator.component.activiteitLocatieaanduidingen$ = of([]);

    expect(spectator.query('dsov-activiteiten')).toExist();
  });

  describe('On Init', () => {
    it('should initialize observables', () => {
      spectator.component.annotation.annotationId = mockAnnotationId;
      spectator.component.documentId = 'documentId';
      spectator.component.ngOnInit();

      expect(spyOnGetLocatiesById).toHaveBeenCalledWith(mockAnnotationId);
      expect(spyOnGetAnnotationStatusById).toHaveBeenCalledWith(mockAnnotationId);
    });
  });
});
