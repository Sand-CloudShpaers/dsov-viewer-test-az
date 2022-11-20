import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { DocumentStructuurIhrService } from '~viewer/documenten/+state/document-structuur/document-structuur-ihr.service';
import { DocumentViewContext } from '~viewer/documenten/types/layout.model';

describe('DocumentStructuurIhrService', () => {
  let spectator: SpectatorService<DocumentStructuurIhrService>;

  const createService = createServiceFactory({
    service: DocumentStructuurIhrService,
    imports: [],
    providers: [],
  });

  beforeEach(() => {
    spectator = createService();
  });

  it('should create', () => {
    expect(spectator.service).toBeTruthy();
  });

  it('Type should not be HOOFDSTUK', () => {
    const mapDocumentStructuurElement = DocumentStructuurIhrService.mapDocumentStructuurElement(
      {
        inhoud: null,
        titel: 'Hoofdstuk 4 Overgangs- en slotregels',
        externeReferentie: {
          href: 'https://ruimtelijkeplannen.nl/documents/NL.IMRO.0034.BP1AMQS01-on01/t_NL.IMRO.0034.BP1AMQS01-on01.html#_3.4.3_Overgangs-enslotregels',
          label: 'Link naar de toelichting op de Overgangs- en slotregels',
        },
        _links: {
          figuren: [],
          structuurvisieverklaringen: [],
          structuurvisiegebieden: [],
          lettertekenaanduidingen: [],
          besluitvlakken: [],
          maatvoeringen: [],
          children: [
            {
              href: 'https://ruimte.omgevingswet.overheid.nl/ruimtelijke-plannen/api/opvragen/v4/plannen/NL.IMRO.0034.BP1AMQS01-on01/teksten/NL.IMRO.PT.regels._24_Overgangsrecht',
            },
            {
              href: 'https://ruimte.omgevingswet.overheid.nl/ruimtelijke-plannen/api/opvragen/v4/plannen/NL.IMRO.0034.BP1AMQS01-on01/teksten/NL.IMRO.PT.regels._25_Slotregel',
            },
          ],
          bouwaanduidingen: [],
          besluitsubvlakken: [],
          self: {
            href: 'https://ruimte.omgevingswet.overheid.nl/ruimtelijke-plannen/api/opvragen/v4/plannen/NL.IMRO.0034.BP1AMQS01-on01/teksten/NL.IMRO.PT.regels._4_Overgangs-enslotregels',
          },
          structuurvisiecomplexen: [],
          functieaanduidingen: [],
          bestemmingsvlakken: [],
          gebiedsaanduidingen: [],
        },
        volgnummer: 196,
        id: 'NL.IMRO.PT.regels._4_Overgangs-enslotregels',
        kruimelpad: [
          {
            titel: 'Regels',
            volgnummer: 2,
            id: 'NL.IMRO.PT.regels.s784',
          },
        ],
      },
      undefined,
      1,
      {},
      DocumentViewContext.VOLLEDIG_DOCUMENT,
      [
        {
          id: 'NL.IMRO.PT.regels.s784',
          titel: 'Regels',
        },
      ],
      'NL.IMRO.0034.BP1AMQS01-on01'
    );

    expect(mapDocumentStructuurElement.type).toEqual('HOOFDSTUK');
  });
});
