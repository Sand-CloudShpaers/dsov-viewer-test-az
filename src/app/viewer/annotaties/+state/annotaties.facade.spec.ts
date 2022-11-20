import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { State } from '~store/state';
import { AnnotatiesFacade } from './annotaties.facade';
import { OmgevingsDocumentService } from '~viewer/documenten/services/omgevings-document.service';
import { mockProvider } from '@ngneat/spectator';
import { ActiviteitLocatieaanduidingenGroepVM } from '~viewer/gebieds-info/types/gebieds-info.model';
import { DerivedLoadingState } from '~general/utils/store.utils';
import { mockAanduidingLocaties } from '~viewer/overzicht/activiteiten/+state/activiteiten.mock';
import {
  mockActiviteitLocatieaanduidingenResponse,
  mockActiviteitLocatieaanduidingenVM,
} from '~viewer/annotaties/+state/activiteit-locatieaanduidingen/activiteit-locatieaanduidingen.mock';
import { mockGebiedsaanwijzingenResponse } from '~viewer/gebieds-info/+state/gebiedsaanwijzingen/gebiedsaanwijzingen.mock';
import { mockOmgevingsnormenResponse } from '~viewer/gebieds-info/+state/omgevingsnormen/omgevingsnormen.mock';
import { mockOmgevingswaardenResponse } from '~viewer/gebieds-info/+state/omgevingswaarden/omgevingswaarden.mock';
import { GebiedsaanwijzingenVM } from '~viewer/gebiedsaanwijzingen/types/gebiedsaanwijzingenVM';
import { OmgevingsnormenVM } from '~viewer/normen/types/omgevingsnormenVM';
import { AnnotatieHoofdlijnenVM } from '~viewer/annotaties/types/hoofdlijnen';
import { locatiesResponseMock } from '~viewer/annotaties/mocks/annotaties.mocks';
import * as AanduidingLocatiesActions from '~viewer/annotaties/+state/aanduiding-locaties/aanduiding-locaties.actions';
import { LocatieVM } from '~viewer/annotaties/types/locatieVM';
import { mockHoofdlijnenResponse } from '~viewer/documenten/+state/hoofdlijnen/hoofdlijnen.mock';
import { NormType } from '~viewer/annotaties/types/annotaties-enums';
import initialState from '~mocks/initial-state';
import { DocumentViewContext } from '~viewer/documenten/types/layout.model';
import { getAnnotationEntityId } from '../helpers/annotaties';
import { mockAnnotationEntityId, mockAnnotationId } from './annotaties.selectors.spec';

const entityId = mockAnnotationEntityId;

describe('AnnotatiesFacade', () => {
  let annotatiesFacade: AnnotatiesFacade;
  let store$: Store<State>;
  const localInitialState = {
    ...initialState,
    annotaties: {
      locaties: {
        entities: {
          [entityId]: {
            href: 'href',
            data: {
              vastgesteld: locatiesResponseMock,
            },
          },
        },
        ids: [entityId],
      },
      activiteitLocatieaanduidingen: {
        entities: {
          [entityId]: {
            data: {
              elementId: [
                getAnnotationEntityId({
                  identificatie: 'regeltekstId',
                  elementId: 'elementId',
                }),
              ],
              vastgesteld: mockActiviteitLocatieaanduidingenResponse,
              ontwerp: undefined,
            },
            status: 'RESOLVED',
          },
        },
      },
      aanduidingLocaties: {
        entities: {
          'activiteitId/activiteitlocatieaanduidingen/activiteitLocatieaanduidingId': {
            data: mockAanduidingLocaties,
            entityId: 'activiteitId/activiteitlocatieaanduidingen/activiteitLocatieaanduidingId',
            status: 'RESOLVED',
          },
        },
      },
      gebiedsaanwijzingen: {
        entities: {
          [entityId]: {
            data: {
              elementId: 'https://blub/gebiedsaanwijzingen?regeltekstIdentificatie=blab',
              vastgesteld: mockGebiedsaanwijzingenResponse,
              ontwerp: [],
            },
            entityId,
            status: 'RESOLVED',
          },
        },
        ids: [entityId],
      },
      omgevingswaarden: {
        entities: {
          [entityId]: {
            data: {
              elementId: 'wateenwaarde',
              vastgesteld: mockOmgevingswaardenResponse,
              ontwerp: undefined,
            },
            entityId: 'wateenwaarde',
            status: 'RESOLVED',
          },
        },
        ids: [entityId],
      },
      omgevingsnormen: {
        entities: {
          [entityId]: {
            data: {
              elementId: 'wateennormen',
              vastgesteld: mockOmgevingsnormenResponse,
              ontwerp: undefined,
            },
            entityId: 'wateennormen',
            status: 'RESOLVED',
          },
        },
        ids: [entityId],
      },
      hoofdlijnen: {
        entities: {
          [entityId]: {
            data: {
              elementId: 'https://linkNaarHoofdlijnen.nl',
              vastgesteld: mockHoofdlijnenResponse,
              ontwerp: undefined,
            },
            entityId: entityId,
            status: 'RESOLVED',
          },
        },
        ids: [entityId],
      },
      'bestemmingsplan-features': {
        entities: {
          [entityId]: {
            data: {
              id: 'dummy##regeltekst1',
              annotationId: 'dummy##regeltekst1',
              documentId: 'dummy',
              ihrLocatieIds: ['NL.IMRO.EB60708'],
              symboolHref:
                'https://ruimte.omgevingswet.overheid.nl/ruimtelijke-plannen/api/opvragen/v4/plannen/NL.IMRO.0059.BPKtVHrxmstrjte918-VG01/bestemmingsvlakken/NL.IMRO.EB60708',
              selectionObjectType: 'Bestemmingsvlakken',
              type: '[Annotaties] BestemmingsplanFeatures Laden Success',
            },
          },
        },
        ids: [entityId],
      },
      kaarten: {
        entities: {},
        ids: [],
      },
      idealisatie: {
        entities: {},
        ids: [],
      },
    },
  } as any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AnnotatiesFacade,
        mockProvider(OmgevingsDocumentService),
        provideMockStore({
          initialState: localInitialState,
        }),
      ],
    });
    annotatiesFacade = TestBed.inject(AnnotatiesFacade);
    store$ = TestBed.inject(Store);
    spyOn(store$, 'dispatch').and.stub();
  });

  it('should be created', () => {
    expect(annotatiesFacade).toBeTruthy();
  });

  it('should get locaties', async () => {
    annotatiesFacade.getLocatiesById$(mockAnnotationId).subscribe(result => {
      expect(result as LocatieVM[]).toEqual([
        {
          identificatie: 'gebied-zonder-noemer',
          naam: '',
          isSelected: false,
          symboolcode: 'werkingsgebied',
          isOntwerp: false,
        },
        {
          identificatie: 'gebied-met-lege-noemer',
          naam: '',
          isSelected: false,
          symboolcode: 'werkingsgebied',
          isOntwerp: false,
        },
        {
          identificatie: 'gebied-moet-vooraan',
          naam: 'a-gebied',
          isSelected: false,
          symboolcode: 'werkingsgebied',
          isOntwerp: false,
        },
        {
          identificatie: 'test-gebied',
          naam: 'test',
          isSelected: false,
          symboolcode: 'werkingsgebied',
          isOntwerp: false,
        },
      ]);
    });
  });

  it('should get annotaties status by id', async () => {
    annotatiesFacade.getAnnotatiesStatusById$(mockAnnotationId).subscribe(result => {
      expect(result as DerivedLoadingState).toEqual({
        isLoading: false,
        isIdle: false,
        isPending: false,
        isResolved: true,
        isRejected: false,
        isLoaded: true,
      });
    });
  });

  it('should get activiteitlocatieaanduidingen by id', async () => {
    annotatiesFacade.getactiviteitLocatieaanduidingenById$(mockAnnotationId).subscribe(result => {
      expect(result as ActiviteitLocatieaanduidingenGroepVM[]).toEqual([
        {
          code: 'Dagjeweg.nl',
          waarde: 'Dagje uit',
          activiteitLocatieaanduidingen: [
            {
              identificatie: '1234',
              naam: 'Dagje naar de Efteling',
              regelkwalificatie: 'waarde',
              isOntwerp: false,
              isSelected: false,
              kwalificeertHref: 'https://iedereen/is/welkom',
              symboolcode: undefined,
            },
          ],
        },
      ]);
    });
  });

  it('should get getAanduidingLocaties by ids', async () => {
    annotatiesFacade
      .getAanduidingLocatiesByIds$(['activiteitId/activiteitlocatieaanduidingen/activiteitLocatieaanduidingId'])
      .subscribe(result => {
        expect(result).toEqual([
          {
            id: 'activiteitId/activiteitlocatieaanduidingen/activiteitLocatieaanduidingId',
            locaties: [
              {
                identificatie: 'gebied1',
                naam: 'Gebied 1',
                isOntwerp: false,
              },
              {
                identificatie: 'gebied2',
                naam: 'Gebied 2',
                isOntwerp: false,
              },
            ],
          },
        ]);
      });
  });

  it('should get getGebiedsaanwijzingen by id', async () => {
    annotatiesFacade.getGebiedsaanwijzingenById$(mockAnnotationId).subscribe(result => {
      expect(result as GebiedsaanwijzingenVM[]).toEqual([
        {
          gebiedsaanwijzingType: 'type',
          label: 'Beperkingengebieden',
          gebiedsaanwijzingen: [
            {
              identificatie: 'identificatie',
              naam: 'naam',
              groep: 'groep',
              isOntwerp: false,
              isSelected: false,
              symboolcode: undefined,
            },
          ],
        },
      ]);
    });
  });

  it('should get Omgevingswaarden by id', async () => {
    annotatiesFacade.getOmgevingswaardenById$(mockAnnotationId).subscribe(result => {
      expect(result as OmgevingsnormenVM[]).toEqual([
        {
          identificatie: 'code',
          naam: 'waarde',
          normen: [
            {
              identificatie: 'normId',
              naam: 'naam',
              eenheid: '',
              type: 'waarde',
              normType: NormType.OMGEVINGSWAARDEN,
              normwaarden: [
                {
                  identificatie: 'normwaardeId',
                  naam: 'veel waarde',
                  representationLabel: 'veel waarde',
                  symboolcode: undefined,
                  isOntwerp: false,
                  isSelected: false,
                },
              ],
            },
          ],
        },
      ]);
    });
  });

  it('should get Omgevingsnormen by id', async () => {
    annotatiesFacade
      .getOmgevingsnormenById$(mockAnnotationId, DocumentViewContext.VOLLEDIG_DOCUMENT)
      .subscribe(result => {
        expect(result as OmgevingsnormenVM[]).toEqual([
          {
            identificatie: 'code',
            naam: 'waarde',
            normen: [
              {
                identificatie: 'normId',
                naam: 'naam',
                eenheid: '',
                normType: NormType.OMGEVINGSNORMEN,
                normwaarden: [
                  {
                    identificatie: 'normwaardeId',
                    naam: 'veel waarde',
                    representationLabel: 'veel waarde',
                    isOntwerp: false,
                    isSelected: false,
                    symboolcode: undefined,
                  },
                ],
                type: 'waarde',
              },
            ],
          },
        ]);
      });
  });

  it('should get hoofdlijnen by id', async () => {
    annotatiesFacade.getHoofdlijnenById$(mockAnnotationId).subscribe(result => {
      expect(result as AnnotatieHoofdlijnenVM[]).toEqual([
        {
          identificatie: 'Doelstelling',
          naam: 'Doelstelling',
          hoofdlijnen: [
            {
              identificatie: 'nl.imow-gm0983.hoofdlijn.VRKOVhfst1',
              naam: 'hfst 1',
              soort: 'Doelstelling',
              isOntwerp: false,
            },
          ],
        },
      ]);
    });
  });

  it('should call load for AanduidingLocaties', async () => {
    annotatiesFacade.activiteitLocatieaanduidingenExpanded(mockActiviteitLocatieaanduidingenVM);

    expect(store$.dispatch).toHaveBeenCalledWith(
      AanduidingLocatiesActions.load({
        id: mockActiviteitLocatieaanduidingenVM.identificatie,
        href: mockActiviteitLocatieaanduidingenVM.kwalificeertHref,
      })
    );
  });
});
