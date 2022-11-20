import { createServiceFactory, SpectatorService, SpyObject } from '@ngneat/spectator';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import initialState from '~mocks/initial-state';
import { OmgevingsDocumentService } from '~viewer/documenten/services/omgevings-document.service';
import * as LayoutActions from '~viewer/documenten/+state/layout.actions';
import * as ActiviteitLocatieaanduidingenActions from './activiteit-locatieaanduidingen/activiteit-locatieaanduidingen.actions';
import * as AanduidingLocatiesActions from './aanduiding-locaties/aanduiding-locaties.actions';
import * as GebiedsaanwijzingenActions from './gebiedsaanwijzingen/gebiedsaanwijzingen.actions';
import * as HoofdlijnenActions from './hoofdlijnen/hoofdlijnen.actions';
import * as LocatiesActions from './locaties/locaties.actions';
import * as KaartenActions from './kaarten/kaarten.actions';
import * as IdealisatieActions from './idealisatie/idealisatie.actions';
import * as OmgevingsnormenActions from './omgevingsnormen/omgevingsnormen.actions';
import * as OmgevingswaardenActions from './omgevingswaarden/omgevingswaarden.actions';
import * as BestemmingsplanFeaturesActions from './bestemminsplan-features/bestemmingsplan-features.actions';
import {
  mockOmgevingsnormenResponse,
  mockOntwerpOmgevingsnormenResponse,
} from '~viewer/gebieds-info/+state/omgevingsnormen/omgevingsnormen.mock';
import {
  mockOmgevingswaardenResponse,
  mockOntwerpOmgevingswaardenResponse,
} from '~viewer/gebieds-info/+state/omgevingswaarden/omgevingswaarden.mock';
import { AnnotatiesApiEffects } from './annotaties-api.effects';
import * as fromAnnotationMocks from '../mocks/annotaties.mocks';
import { mockAanduidingLocaties } from '~viewer/overzicht/activiteiten/+state/activiteiten.mock';
import { mockKaartenResponse, mockOntwerpKaartenResponse } from '~viewer/documenten/+state/kaarten/kaarten.mock';
import { IhrProvider } from '~providers/ihr.provider';
import { SelectionObjectType } from '~store/common/selection/selection.model';
import { bestemmingsvlakMock } from './bestemminsplan-features/bestemmingsplan-features.mock';
import { mockLocatiesResponse } from './locaties/locaties.mock';

describe('AnnotatiesApiEffects', () => {
  let spectator: SpectatorService<AnnotatiesApiEffects>;
  let actions$: Observable<Action>;
  let omgevingsDocumentService: SpyObject<OmgevingsDocumentService>;
  let ihrProvider: SpyObject<IhrProvider>;
  const createService = createServiceFactory({
    service: AnnotatiesApiEffects,
    providers: [provideMockActions(() => actions$), provideMockStore({ initialState })],
    mocks: [OmgevingsDocumentService, IhrProvider],
  });

  beforeEach(() => {
    spectator = createService();
    omgevingsDocumentService = spectator.inject(OmgevingsDocumentService);
    ihrProvider = spectator.inject(IhrProvider);
  });

  describe('ActiviteitLocatieaanduidingen', () => {
    it('conditionalLoadActiviteitLocatieaanduidingen$', done => {
      /*
        We kijken of de activiteitenLink aanwezig omdat we deze alleen krijgen als er activiteiten zijn.
        De call doen we obv de regeltekstIdentificatie omdat we niet de activiteiten zelf nodig hebben.
        De regeltekstIdentificatie is altijd aanwezig, de call zou een lege array geven als we niet op aanwezigheid
        van de activiteitenLink controleren.
      */

      actions$ = of(
        LayoutActions.loadAnnotaties({
          annotation: {
            annotationId: {
              identificatie: 'elementId',
              elementId: 'elementId',
            },
            vastgesteld: { activiteitenHref: 'http://url' },
          },
        })
      );

      spectator.service.conditionalLoadActiviteitLocatieaanduidingen$.subscribe(actual => {
        const expected = ActiviteitLocatieaanduidingenActions.loading({
          annotationId: {
            identificatie: 'elementId',
            elementId: 'elementId',
          },
        });

        expect(actual).toEqual(expected);
        done();
      });
    });

    it('loadActiviteitLocatieaanduidingen$', done => {
      omgevingsDocumentService.getActiviteitLocatieaanduidingen$.and.returnValue(
        of(fromAnnotationMocks.activiteitLocatieaanduidingenMock)
      );
      omgevingsDocumentService.getOntwerpActiviteitLocatieaanduidingen$.and.returnValue(
        of(fromAnnotationMocks.ontwerpActiviteitLocatieaanduidingenMock)
      );
      actions$ = of(
        ActiviteitLocatieaanduidingenActions.loading({
          annotationId: {
            identificatie: 'elementId',
            elementId: 'elementId',
          },
        })
      );

      spectator.service.loadActiviteitLocatieaanduidingen$.subscribe(actual => {
        const expected = ActiviteitLocatieaanduidingenActions.loadSuccess({
          annotationId: {
            identificatie: 'elementId',
            elementId: 'elementId',
          },
          vastgesteld: fromAnnotationMocks.activiteitLocatieaanduidingenMock,
          ontwerp: fromAnnotationMocks.ontwerpActiviteitLocatieaanduidingenMock,
        });

        expect(actual).toEqual(expected);
        done();
      });
    });
  });

  describe('AanduidingLocaties', () => {
    it('expandActiviteitLocatieaanduidingen$', done => {
      actions$ = of(
        AanduidingLocatiesActions.load({
          id: 'test',
          href: 'url',
        })
      );
      spectator.service.expandActiviteitLocatieaanduidingen$.subscribe(actual => {
        const expected = AanduidingLocatiesActions.loading({
          id: 'test',
          href: 'url',
        });

        expect(actual).toEqual(expected);
        done();
      });
    });

    it('loadAanduidingenLocaties$', done => {
      actions$ = of(
        AanduidingLocatiesActions.loading({
          id: 'activiteitId/activiteitlocatieaanduidingen/activiteitLocatieaanduidingId',
          href: 'url',
        })
      );
      omgevingsDocumentService.get$.and.returnValue(of({ _embedded: { locaties: mockAanduidingLocaties.locaties } }));
      spectator.service.loadAanduidingenLocaties$.subscribe(actual => {
        const expected = AanduidingLocatiesActions.loadSuccess(mockAanduidingLocaties);

        expect(actual).toEqual(expected);
        done();
      });
    });
  });

  describe('Gebiedsaanwijzingen', () => {
    const href = 'https://linkNaarGebiedsaanwijzingen.nl';

    it('conditionalLoadGebiedsaanwijzingen$', done => {
      actions$ = of(
        LayoutActions.loadAnnotaties({
          annotation: {
            annotationId: {
              identificatie: 'elementId',
              elementId: 'elementId',
            },
            ontwerp: { gebiedsaanwijzingenHref: href },
          },
        })
      );

      spectator.service.conditionalLoadGebiedsaanwijzingen$.subscribe(actual => {
        const expected = GebiedsaanwijzingenActions.loading({
          href: undefined,
          annotationId: {
            identificatie: 'elementId',
            elementId: 'elementId',
          },
          ontwerpHref: href,
        });

        expect(actual).toEqual(expected);
        done();
      });
    });

    it('loadGebiedsaanwijzingen$', done => {
      const gebiedsaanwijzingen = fromAnnotationMocks.gebiedsaanwijzingenMock;
      const ontwerpGebiedsaanwijzingen = fromAnnotationMocks.ontwerpGebiedsaanwijzingenMock;
      omgevingsDocumentService.get$.and.returnValues(of(gebiedsaanwijzingen), of(ontwerpGebiedsaanwijzingen));
      actions$ = of(
        GebiedsaanwijzingenActions.loading({
          href,
          annotationId: {
            identificatie: 'elementId',
            elementId: 'elementId',
          },
          ontwerpHref: '',
        })
      );

      spectator.service.loadGebiedsaanwijzingen$.subscribe(actual => {
        const expected = GebiedsaanwijzingenActions.loadSuccess({
          annotationId: {
            identificatie: 'elementId',
            elementId: 'elementId',
          },
          vastgesteld: gebiedsaanwijzingen,
          ontwerp: ontwerpGebiedsaanwijzingen,
        });

        expect(actual).toEqual(expected);
        done();
      });
    });
  });

  describe('Hoofdlijnen', () => {
    const hoofdlijnenHref = 'https://linkNaarHoofdlijnen.nl';

    it('conditionalLoadHoofdlijnen$', done => {
      actions$ = of(
        LayoutActions.loadAnnotaties({
          annotation: {
            annotationId: {
              identificatie: 'elementId',
              elementId: 'elementId',
            },
            vastgesteld: { hoofdlijnenHref },
          },
        })
      );

      spectator.service.conditionalLoadHoofdlijnen$.subscribe(actual => {
        const expected = HoofdlijnenActions.loading({
          annotationId: {
            identificatie: 'elementId',
            elementId: 'elementId',
          },
          href: hoofdlijnenHref,
          ontwerpHref: undefined,
        });

        expect(actual).toEqual(expected);
        done();
      });
    });

    it('loadHoofdlijnen$', done => {
      const hoofdlijnen = fromAnnotationMocks.hoofdlijnenResponseMock;
      const ontwerpHoofdlijnen = fromAnnotationMocks.hoofdlijnenOntwerpResponseMock;
      omgevingsDocumentService.get$.and.returnValues(of(hoofdlijnen), of(ontwerpHoofdlijnen));
      actions$ = of(
        HoofdlijnenActions.loading({
          annotationId: {
            identificatie: 'elementId',
            elementId: 'elementId',
          },
          href: hoofdlijnenHref,
          ontwerpHref: '',
        })
      );

      spectator.service.loadHoofdlijnen$.subscribe(actual => {
        const expected = HoofdlijnenActions.loadSuccess({
          annotationId: {
            identificatie: 'elementId',
            elementId: 'elementId',
          },
          vastgesteld: hoofdlijnen,
          ontwerp: ontwerpHoofdlijnen,
        });

        expect(actual).toEqual(expected);
        done();
      });
    });
  });

  describe('Locaties', () => {
    const locatiesHref = 'https://linkNaarLocaties.nl';

    it('conditionalLoadLocaties$', done => {
      actions$ = of(
        LayoutActions.loadAnnotaties({
          annotation: {
            annotationId: {
              identificatie: 'elementId',
              elementId: 'elementId',
            },
            vastgesteld: { locatiesHref },
          },
        })
      );

      spectator.service.conditionalLoadLocaties$.subscribe(actual => {
        const expected = LocatiesActions.loading({
          annotationId: {
            identificatie: 'elementId',
            elementId: 'elementId',
          },
          href: locatiesHref,
          ontwerpHref: undefined,
        });

        expect(actual).toEqual(expected);
        done();
      });
    });

    it('loadLocaties$', done => {
      const locaties = fromAnnotationMocks.locatiesResponseMock;
      const ontwerpLocaties = fromAnnotationMocks.ontwerpLocatiesResponseMock;
      omgevingsDocumentService.get$.and.returnValues(of(locaties), of(ontwerpLocaties));
      actions$ = of(
        LocatiesActions.loading({
          annotationId: {
            identificatie: 'elementId',
            elementId: 'elementId',
          },
          href: locatiesHref,
          ontwerpHref: locatiesHref,
        })
      );
      spectator.service.loadLocaties$.subscribe(actual => {
        const expected = LocatiesActions.loadSuccess({
          annotationId: {
            identificatie: 'elementId',
            elementId: 'elementId',
          },
          vastgesteld: locaties,
          ontwerp: ontwerpLocaties,
        });

        expect(actual).toEqual(expected);
        done();
      });
    });
  });

  describe('loadOmgevingsnormen$', () => {
    const omgevingsnormenHref = 'https://linkNaarOmgevingsnormen.nl';

    it('conditionalLoadOmgevingsnormen', done => {
      actions$ = of(
        LayoutActions.loadAnnotaties({
          annotation: {
            annotationId: {
              identificatie: 'elementId',
              elementId: 'elementId',
            },
            vastgesteld: { omgevingsnormenHref },
          },
        })
      );

      spectator.service.conditionalLoadOmgevingsnormen$.subscribe(actual => {
        const expected = OmgevingsnormenActions.loading({
          annotationId: {
            identificatie: 'elementId',
            elementId: 'elementId',
          },
          href: omgevingsnormenHref,
          ontwerpHref: undefined,
        });

        expect(actual).toEqual(expected);
        done();
      });
    });

    it('loadOmgevingsnormen$', done => {
      omgevingsDocumentService.get$.and.returnValues(
        of(mockOmgevingsnormenResponse),
        of(mockOntwerpOmgevingsnormenResponse)
      );
      actions$ = of(
        OmgevingsnormenActions.loading({
          annotationId: {
            identificatie: 'elementId',
            elementId: 'elementId',
          },
          href: omgevingsnormenHref,
          ontwerpHref: 'link naar ontwerp',
        })
      );

      spectator.service.loadOmgevingsnormen$.subscribe(actual => {
        const expected = OmgevingsnormenActions.loadSuccess({
          annotationId: {
            identificatie: 'elementId',
            elementId: 'elementId',
          },
          vastgesteld: mockOmgevingsnormenResponse,
          ontwerp: mockOntwerpOmgevingsnormenResponse,
        });

        expect(actual).toEqual(expected);
        done();
      });
    });
  });

  describe('Omgevingswaarden', () => {
    const omgevingswaardenHref = 'https://linkNaarOmgevingswaarden.nl';

    it('conditionalLoadOmgevingswaarden$', done => {
      actions$ = of(
        LayoutActions.loadAnnotaties({
          annotation: {
            annotationId: {
              identificatie: 'elementId',
              elementId: 'elementId',
            },
            vastgesteld: { omgevingswaardenHref },
          },
        })
      );

      spectator.service.conditionalLoadOmgevingswaarden$.subscribe(actual => {
        const expected = OmgevingswaardenActions.loading({
          annotationId: {
            identificatie: 'elementId',
            elementId: 'elementId',
          },
          href: omgevingswaardenHref,
          ontwerpHref: undefined,
        });

        expect(actual).toEqual(expected);
        done();
      });
    });

    it('loadOmgevingswaarden$', done => {
      omgevingsDocumentService.get$.and.returnValues(
        of(mockOmgevingswaardenResponse),
        of(mockOntwerpOmgevingswaardenResponse)
      );
      actions$ = of(
        OmgevingswaardenActions.loading({
          annotationId: {
            identificatie: 'elementId',
            elementId: 'elementId',
          },
          href: omgevingswaardenHref,
          ontwerpHref: 'link naar ontwerp',
        })
      );

      spectator.service.loadOmgevingswaarden$.subscribe(actual => {
        const expected = OmgevingswaardenActions.loadSuccess({
          annotationId: {
            identificatie: 'elementId',
            elementId: 'elementId',
          },
          vastgesteld: mockOmgevingswaardenResponse,
          ontwerp: mockOntwerpOmgevingswaardenResponse,
        });

        expect(actual).toEqual(expected);
        done();
      });
    });
  });

  describe('Kaarten', () => {
    const kaartenHref = 'https://linkNaarKaarten.nl';

    it('conditionalKaarten$', done => {
      actions$ = of(
        LayoutActions.loadAnnotaties({
          annotation: {
            annotationId: {
              identificatie: 'elementId',
              elementId: 'elementId',
            },
            vastgesteld: { kaartenHref },
          },
        })
      );

      spectator.service.conditionalKaarten$.subscribe(actual => {
        const expected = KaartenActions.loading({
          annotationId: {
            identificatie: 'elementId',
            elementId: 'elementId',
          },
          href: kaartenHref,
          ontwerpHref: undefined,
        });

        expect(actual).toEqual(expected);
        done();
      });
    });

    it('loadKaarten$', done => {
      omgevingsDocumentService.get$.and.returnValues(of(mockKaartenResponse), of(mockOntwerpKaartenResponse));
      actions$ = of(
        KaartenActions.loading({
          annotationId: {
            identificatie: 'elementId',
            elementId: 'elementId',
          },
          href: kaartenHref,
          ontwerpHref: 'link naar ontwerp',
        })
      );

      spectator.service.loadKaarten$.subscribe(actual => {
        const expected = KaartenActions.loadSuccess({
          annotationId: {
            identificatie: 'elementId',
            elementId: 'elementId',
          },
          vastgesteld: mockKaartenResponse,
          ontwerp: mockOntwerpKaartenResponse,
        });

        expect(actual).toEqual(expected);
        done();
      });
    });
  });

  describe('Idealisatie', () => {
    const idealisatieHref = 'locaties?regeltekstIdentificatie=regeltekstId';

    it('loadIdealisatie$', done => {
      actions$ = of(
        LayoutActions.loadAnnotaties({
          annotation: {
            annotationId: {
              identificatie: 'elementId',
              elementId: 'elementId',
            },
            vastgesteld: { idealisatieHref },
          },
        })
      );

      spectator.service.loadIdealisatie$.subscribe(actual => {
        const expected = IdealisatieActions.loading({
          annotationId: {
            identificatie: 'elementId',
            elementId: 'elementId',
          },
          href: idealisatieHref,
        });

        expect(actual).toEqual(expected);
        done();
      });
    });

    it('loadingIdealisatie$', done => {
      omgevingsDocumentService.get$.and.returnValues(of(mockLocatiesResponse));
      actions$ = of(
        IdealisatieActions.loading({
          annotationId: {
            identificatie: 'elementId',
            elementId: 'elementId',
          },
          href: idealisatieHref,
        })
      );

      spectator.service.loadingIdealisatie$.subscribe(actual => {
        const expected = IdealisatieActions.loadSuccess({
          annotationId: {
            identificatie: 'elementId',
            elementId: 'elementId',
          },
          locaties: mockLocatiesResponse,
        });

        expect(actual).toEqual(expected);
        done();
      });
    });
  });

  describe('BestemmingsplanFeatures', () => {
    it('should Load Bestemmingsplan Features', done => {
      ihrProvider.fetchBestemmingsplanFeature$.and.returnValues(of(bestemmingsvlakMock));
      actions$ = of(
        BestemmingsplanFeaturesActions.loading({
          annotationId: {
            identificatie: 'elementId',
            elementId: 'elementId',
          },
          documentId: 'documentId',
          featureGroups: [
            {
              objectType: SelectionObjectType.BESTEMMINGSVLAK,
              hrefs: ['href'],
            },
          ],
        })
      );

      spectator.service.loadBestemmingsplanFeatures$.subscribe(actual => {
        const expected = BestemmingsplanFeaturesActions.loadSuccess({
          annotationId: {
            identificatie: 'elementId',
            elementId: 'elementId',
          },
          features: [
            {
              objectType: SelectionObjectType.BESTEMMINGSVLAK,
              documentId: 'documentId',
              feature: bestemmingsvlakMock,
            },
          ],
        });

        expect(actual).toEqual(expected);
        done();
      });
    });
  });
});
