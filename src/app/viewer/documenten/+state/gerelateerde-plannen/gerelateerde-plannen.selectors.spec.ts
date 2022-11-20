import { GerelateerdPlan } from '~ihr-model/gerelateerdPlan';
import { PlanType } from '~ihr-model/planType';
import { PlanstatusInfo } from '~ihr-model/planstatusInfo';
import * as fromSelectors from '~viewer/documenten/+state/gerelateerde-plannen/gerelateerde-plannen.selectors';
import { Bestuurslaag, DocumentVM } from '~viewer/documenten/types/documenten.model';
import { ApiSource } from '~model/internal/api-source';
import { DocumentSubPagePath } from '~viewer/documenten/types/document-pages';
import { createIhrPlanMock } from '~mocks/documenten.mock';
import { getDocumentVM } from '~viewer/documenten/utils/document-utils';

export const gerelateerdePlannenMock: GerelateerdPlan[] = [
  {
    id: 'NL.IMRO.gerelateerd-plan',
    type: PlanType.Bestemmingsplan,
    beleidsmatigVerantwoordelijkeOverheid: {
      naam: 'DeOverheid',
    },
    publicerendBevoegdGezag: {
      naam: 'publicerendBevoegdGezag',
    },
    naam: 'LeukPlan',
    planstatusInfo: {
      planstatus: PlanstatusInfo.PlanstatusEnum.Ontwerp,
      datum: '01-01-2021',
    },
    isHistorisch: true,
    verwijderdOp: undefined,
    _links: {
      self: {
        href: 'linkNaarMezelf',
      },
    },
    eindeRechtsgeldigheid: '01-01-2023',
    relatietype: 'tenGevolgeVan',
    dossier: null,
  },
];

export const gerelateerdePlannenDocumentVMMock: DocumentVM[] = [
  {
    documentId: 'NL.IMRO.gerelateerd-plan',
    type: 'Bestemmingsplan',
    bevoegdGezag: {
      naam: 'DeOverheid',
      code: undefined,
      bestuurslaag: undefined,
    },
    title: 'LeukPlan',
    status: 'ontwerp',
    dossierStatus: undefined,
    geldigVanaf: new Date('01-01-2021'),
    isHistorisch: true,
    subPages: [],
    apiSource: ApiSource.IHR,
    isOmgevingsvergunning: false,
    identificatie: 'NL.IMRO.gerelateerd-plan',
    isVerwijderdOp: undefined,
    locationHref: 'linkNaarMezelf?expand=bbox',
    statusDateLine: 'ontwerp 01-01-2021',
  },
];

export const gerelateerdePlannenDocumentVMVerwijderdMock: DocumentVM[] = [
  {
    documentId: 'NL.IMRO.gerelateerd-plan',
    type: 'Bestemmingsplan',
    bevoegdGezag: {
      naam: 'DeOverheid',
      code: undefined,
      bestuurslaag: Bestuurslaag.GEMEENTE,
    },
    title: 'LeukPlan',
    status: 'ontwerp',
    geldigVanaf: new Date('01-01-2021'),
    isHistorisch: true,
    statusDateLine: '',
    subPages: [
      { path: DocumentSubPagePath.INHOUD, label: 'Inhoud' },
      { path: DocumentSubPagePath.GERELATEERD, label: 'Gerelateerd' },
      { path: DocumentSubPagePath.KAARTEN, label: 'Kaarten' },
      { path: DocumentSubPagePath.LOCATIEDETAILS, label: 'Details op locatie' },
    ],
    apiSource: ApiSource.IHR,
    isOmgevingsvergunning: false,
    identificatie: 'NL.IMRO.gerelateerd-plan',
    dossierStatus: undefined,
    isVerwijderdOp: '2020-01-01',
    eindeRechtsgeldigheid: '01-01-2020',
    hasDocumentStructure: undefined,
    locationHref: 'linkNaarMezelf?expand=bbox',
    extent: undefined,
    ondergronden: undefined,
  },
];

describe('GerelateerdePlannenSelectors', () => {
  it('should return gerelateerde plannen for plan with documentId', () => {
    const id = 'NL.IMRO.plan-met-relaties';

    expect(
      fromSelectors.getGerelateerdePlannen(id).projector({
        'NL.IMRO.plan-met-relaties': {
          data: { gerelateerdePlannen: gerelateerdePlannenMock, gerelateerdVanuit: undefined, dossier: undefined },
          entityId: id,
          status: 'RESOLVED',
        },
      })
    ).toEqual(gerelateerdePlannenDocumentVMMock);
  });

  it('should return gerelateerdVanuit for plan with documentId', () => {
    const id = 'NL.IMRO.plan-met-relaties';

    expect(
      fromSelectors.getGerelateerdVanuit(id).projector({
        'NL.IMRO.plan-met-relaties': {
          data: { gerelateerdePlannen: undefined, gerelateerdVanuit: gerelateerdePlannenMock, dossier: undefined },
          entityId: id,
          status: 'RESOLVED',
        },
      })
    ).toEqual(gerelateerdePlannenDocumentVMMock);
  });

  it('should return dossier plannen', () => {
    const id = 'NL.IMRO.plan';

    expect(
      fromSelectors.getDossierPlannen(id).projector({
        [id]: {
          data: { gerelateerd: undefined, dossier: [{ ...createIhrPlanMock(), id }, createIhrPlanMock()] },
          entityId: id,
          status: 'RESOLVED',
        },
      })
    ).toEqual([getDocumentVM(createIhrPlanMock())]);
  });
});
