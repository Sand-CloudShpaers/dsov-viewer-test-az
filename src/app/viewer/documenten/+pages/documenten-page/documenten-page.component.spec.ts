import { ActivatedRoute, Router } from '@angular/router';
import { MockComponent } from 'ng-mocks';
import { createRoutingFactory, mockProvider, SpectatorRouting } from '@ngneat/spectator';
import { of } from 'rxjs';
import { NavigationFacade } from '~store/common/navigation/+state/navigation.facade';
import { DocumentenFacade } from '~viewer/documenten/+state/documenten.facade';
import { DocumentHeaderContainerComponent } from '~viewer/documenten/components/document-header-container/document-header-container.component';
import { DocumentenPageComponent } from './documenten-page.component';
import { DocumentPageNavComponent } from '~viewer/documenten/components/document-page-nav/document-page-nav.component';
import { KaartServiceMock } from '~viewer/kaart/services/kaart.service.mock';
import { KaartService } from '~viewer/kaart/services/kaart.service';
import { NavigationPaths } from '~store/common/navigation/types/navigation-paths';
import { RouterTestingModule } from '@angular/router/testing';
import { ConfigService } from '~services/config.service';
import { ViewerPage } from '~store/common/navigation/types/application-page';
import { Bestuurslaag } from '~viewer/documenten/types/documenten.model';
import { FilterFacade } from '~viewer/filter/filter.facade';

describe('DocumentenPageComponent', () => {
  let spectator: SpectatorRouting<DocumentenPageComponent>;
  const spyOnResetSelectedDocument = jasmine.createSpy('spyOnResetSelectedDocument');
  const spyOnNavigate = jasmine.createSpy('spyOnNavigate');
  const spyOnCollapseAllElements = jasmine.createSpy('spyOnCollapseAllElements');
  const spyOn_setFiltersFromQueryParams = jasmine.createSpy('spyOn_setFiltersFromQueryParams');
  const spyOnLoadDocument = jasmine.createSpy('spyOnLoadDocument');

  const navigationPaths: NavigationPaths = {
    [ViewerPage.OVERZICHT]: null,
    [ViewerPage.THEMAS]: null,
    [ViewerPage.GEBIEDEN]: null,
    [ViewerPage.ACTIVITEITEN]: null,
    [ViewerPage.DOCUMENTEN]: null,
    [ViewerPage.REGELSOPMAAT]: '/path',
    [ViewerPage.DOCUMENT]: null,
  };

  const createComponent = createRoutingFactory({
    component: DocumentenPageComponent,
    imports: [RouterTestingModule],
    stubsEnabled: false,
    providers: [
      mockProvider(DocumentenFacade, {
        resetSelectedDocument: spyOnResetSelectedDocument,
        collapseAllElements: spyOnCollapseAllElements,
        loadDocument: spyOnLoadDocument,
        documentStructuurStatus$: () => of({}),
        documentVM$: () =>
          of({
            type: 'doc-type',
            bevoegdGezag: {
              naam: 'Gemeente Plexat',
              code: '123',
              bestuurslaag: Bestuurslaag.GEMEENTE,
            },
          }),
      }),
      mockProvider(NavigationFacade),
      mockProvider(FilterFacade, {
        setFiltersFromQueryParams: spyOn_setFiltersFromQueryParams,
      }),
      mockProvider(Router, {
        navigate: spyOnNavigate,
      }),
      mockProvider(ActivatedRoute),
      { provide: KaartService, useClass: KaartServiceMock },
      {
        provide: ConfigService,
        useValue: {
          config: {
            ihr: {
              disabled: 'false',
            },
          },
        },
      },
    ],
    declarations: [MockComponent(DocumentHeaderContainerComponent), MockComponent(DocumentPageNavComponent)],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should select document based on route id ', () => {
    spectator.setRouteParam('id', '1234');
    spectator.setRouteQueryParam('inWerkingOp', '12-12-2020');
    spectator.setRouteQueryParam('geldigOp', '12-12-2020');
    spectator.setRouteQueryParam('beschikbaarOp', '12-12-2020');
    spectator.component.ngOnInit();

    expect(spyOnLoadDocument).toHaveBeenCalledWith({ documentId: '1234' }, true, {
      inWerkingOp: '12-12-2020',
      geldigOp: '12-12-2020',
      beschikbaarOp: '12-12-2020',
    });
  });

  it('should navigate back to "zoekresultaten"', () => {
    spectator.component.back(navigationPaths);

    expect(spyOnNavigate).toHaveBeenCalledWith(['/path'], {
      queryParamsHandling: 'merge',
      queryParams: { isOntwerp: null },
    });
  });

  it('should navigate back to "zoeken"', () => {
    spectator.component.back({ ...navigationPaths, regelsopmaat: null });

    expect(spyOnNavigate).toHaveBeenCalledWith(['viewer']);
  });

  describe('OnDestroy', () => {
    it('should collapse all elements', () => {
      spectator.component.ngOnDestroy();

      expect(spyOnResetSelectedDocument).toHaveBeenCalled();
      expect(spyOnCollapseAllElements).toHaveBeenCalled();
    });
  });
});
