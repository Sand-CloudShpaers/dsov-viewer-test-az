import { OntwerpRegeling } from '~ozon-model/ontwerpRegeling';
import { Regeling } from '~ozon-model/regeling';
import {
  Bestuurslaag,
  BestuurslaagExtern,
  BevoegdGezagVM,
  DocumentVM,
  ProcedurestapVM,
} from '~viewer/documenten/types/documenten.model';
import { Omgevingsvergunning } from '~ozon-model/omgevingsvergunning';
import { Plan } from '~ihr-model/plan';
import { ApiSource } from '~model/internal/api-source';
import { documentPages, DocumentSubPage, DocumentSubPagePath, DocumentSubPages } from '../types/document-pages';
import { normalizeString } from '~general/utils/string.utils';
import { TransformGeometryService } from '~services/ozon/transform-geometry.service';
import { FilterIdentification } from '~viewer/filter/types/filter-options';
import { Procedurestap } from '~ozon-model/procedurestap';
import { DocumentType } from '~viewer/documenten/types/document-types';
import { GerelateerdPlan } from '~ihr-model/gerelateerdPlan';
import { formattedDate } from '~general/utils/date.utils';

export const RegelgevingDocumentTypes = [
  DocumentType.amvb,
  DocumentType.ministerieleRegeling,
  DocumentType.omgevingsverordening,
  DocumentType.waterschapsverordening,
  DocumentType.omgevingsPlan,
  DocumentType.instructie,
  DocumentType.aanwijzingsbesluitn2000,
  DocumentType.toegangsbeperkingsbesluit,
  DocumentType.omgevingsvergunning,
];

export const BeleidDocumentTypes = [DocumentType.omgevingsVisie, DocumentType.programma, DocumentType.projectBesluit];

export const ArtikelStructuur = [
  DocumentType.amvb,
  DocumentType.ministerieleRegeling,
  DocumentType.omgevingsverordening,
  DocumentType.waterschapsverordening,
  DocumentType.omgevingsPlan,
  DocumentType.aanwijzingsbesluitn2000,
  DocumentType.toegangsbeperkingsbesluit,
  DocumentType.projectBesluit,
];

export const VrijeTekstStructuur = [DocumentType.omgevingsVisie, DocumentType.instructie, DocumentType.programma];

export enum FilterType {
  activiteit = 'activiteit',
  hoofdlijn = 'hoofdlijn',
  thema = 'thema',
}

export const documentTypes = Object.values(DocumentType);

export function getNormalizedDocumentType(documentType: string): string {
  let documentCardType = '';
  if (documentType) {
    documentCardType = getNormalizedDocumentTypeKey(documentType);
  }
  return documentTypes.find(type => type === documentCardType);
}

export function getNormalizedDocumentTypeKey(key: string): string {
  return key.toLowerCase().replace(/\s/g, '');
}

/**
 * NB: er is niet een een-op-een relatie tussen regels/beleid en regelstructuur/vrijetekst-structuur.
 * Projectbesluiten worden namelijk gezien als 'regel'-domein, maar zijn opgesteld in vrijetekst-structuur.
 * En in Projectbesluiten kunnen ook regels gedefinieerd zijn.
 *
 * Dit betekent dat ongeacht de Filterstate voor Regels en/of Beleid altijd 2 Ozon endpoint moeten worden
 * bevraagd en dat de responses daarvan in de ngrx store moeten worden gezet. In de plannen selector wordt de
 * Filterstate voor Regels en/of Beleid dan vervolgens toegepast in de selectors getDocumentListItemsVM en
 * getAllListItemsVM
 */

export function ozonFilterOnRegelsBeleid(
  regeling: Regeling | OntwerpRegeling | Omgevingsvergunning,
  regelsBeleidFilterState: FilterIdentification[]
): boolean {
  const getRegels = !!regelsBeleidFilterState.filter(f => f.group === 'regelsbeleidType' && f.id === 'regels').length;
  const getBeleid = !!regelsBeleidFilterState.filter(f => f.group === 'regelsbeleidType' && f.id === 'beleid').length;
  if (getRegels && !getBeleid) {
    return isDocumentRegelgeving(regeling.type.waarde);
  } else if (getBeleid && !getRegels) {
    return isDocumentBeleid(regeling.type.waarde);
  } else {
    // Wanneer regels en beleid beide aan of uit staan!
    return true;
  }
}

export function isDocumentRegelgeving(documentType: string): boolean {
  return RegelgevingDocumentTypes.map(type => type.toString()).includes(getNormalizedDocumentType(documentType));
}

export function isDocumentBeleid(documentType: string): boolean {
  return BeleidDocumentTypes.map(type => type.toString()).includes(getNormalizedDocumentType(documentType));
}

export function isArtikelStructuur(documentType: string): boolean {
  return ArtikelStructuur.map(type => type.toString()).includes(getNormalizedDocumentType(documentType));
}

export function isVrijeTekstStructuur(documentType: string): boolean {
  return VrijeTekstStructuur.map(type => type.toString()).includes(getNormalizedDocumentType(documentType));
}

export function getEscapedDocumentId(documentId: string): string {
  return documentId.replaceAll(/[/-]/g, '_');
}

export function encodeSlashes(documentId: string): string {
  return documentId.replaceAll('/', '%2F');
}

export const getDocumentVM = (
  document: Plan | GerelateerdPlan | Regeling | OntwerpRegeling | Omgevingsvergunning
): DocumentVM => {
  if (!document) {
    return null;
  }
  if ((document as Plan | GerelateerdPlan).id) {
    if ((document as Plan).heeftOnderdelen) {
      return mapPlan(<Plan>document);
    } else {
      return mapGerelateerdPlan(<GerelateerdPlan>document);
    }
  }
  if ((document as Omgevingsvergunning).type.waarde.toLowerCase() === DocumentType.omgevingsvergunning) {
    return mapOmgevingsvergunning(<Omgevingsvergunning>document);
  }
  if ((document as OntwerpRegeling).ontwerpbesluitIdentificatie) {
    return mapOntwerpRegeling(<OntwerpRegeling>document);
  }
  return mapRegeling(<Regeling>document);
};

function mapRegeling(document: Regeling): DocumentVM {
  return {
    documentId: document.identificatie,
    isOmgevingsvergunning: false,
    identificatie: document.identificatie,
    type: document.type.waarde,
    status: 'vastgesteld',
    geldigVanaf: new Date(document.geregistreerdMet.beginGeldigheid),
    inwerkingVanaf: new Date(document.geregistreerdMet.beginInwerking),
    bekendOp: new Date(document.geregistreerdMet.tijdstipRegistratie),
    bevoegdGezag: getBevoegdGezagOzon(document),
    title: document.citeerTitel ? document.citeerTitel : `${document.type.waarde} ${document.aangeleverdDoorEen?.naam}`,
    opschrift: document.opschrift,
    statusDateLine: getRegelingStatusDateLine(document),
    tijdelijkeDelen: document.heeftTijdelijkDeel?.map(deel => ({
      documentId: deel.identificatie,
      identificatie: deel.identificatie,
      isOntwerp: false,
      title: deel.citeerTitel,
      type: getTijdelijkRegelingType(deel.type.waarde),
      inwerkingVanaf: new Date(deel.geregistreerdMet.tijdstipRegistratie),
      statusDateLine: getRegelingStatusDateLine(deel),
      apiSource: null,
      subPages: null,
      bevoegdGezag: getBevoegdGezagOzon(deel),
      opschrift: deel.opschrift,
      publicatie: deel.publicatieID,
      geldigVanaf: new Date(deel.geregistreerdMet.beginGeldigheid),
    })),
    publicatie: document.publicatieID,
    locationHref: document._links?.heeftRegelingsgebied?.href,
    hasDocumentStructure: true,
    subPages: getOzonSubPages(document),
    apiSource: ApiSource.OZON,
  };
}

function getTijdelijkRegelingType(deelTypeWaarde: string): string {
  switch (deelTypeWaarde) {
    case 'Voorbeschermingsregels':
      return 'voorbereidingsbesluit';
    case 'Projectbesluit':
      return 'projectbesluit';
    default:
      return 'reactieve interventie';
  }
}

function mapOntwerpRegeling(document: OntwerpRegeling): DocumentVM {
  const bekendOp = document.procedureverloop?.bekendOp ? new Date(document.procedureverloop?.bekendOp) : null;
  const ontvangenOp = document.procedureverloop?.ontvangenOp ? new Date(document.procedureverloop?.ontvangenOp) : null;
  return {
    documentId: document.technischId,
    isOntwerp: true,
    isOmgevingsvergunning: false,
    identificatie: document.identificatie,
    ozonOntwerpbesluitId: document.ontwerpbesluitIdentificatie,
    technischId: document.technischId,
    type: document.type.waarde,
    status: 'ontwerp',
    bevoegdGezag: getBevoegdGezagOzon(document),
    title: document.citeerTitel ? document.citeerTitel : `${document.type.waarde} ${document.aangeleverdDoorEen?.naam}`,
    opschrift: document.opschrift,
    publicatie: document.publicatieID,
    bekendOp,
    ontvangenOp,
    locationHref: document._links?.heeftOntwerpRegelingsgebied?.href || document._links?.heeftRegelingsgebied?.href,
    hasDocumentStructure: true,
    subPages: getOzonSubPages(document),
    apiSource: ApiSource.OZON,
    statusDateLine: getOntwerpRegelingStatusDateLine(bekendOp, ontvangenOp),
    procedurestappen: document.procedureverloop?.procedurestappen
      ? mapProcedurestappen(document.procedureverloop?.procedurestappen)
      : [],
  };
}

function mapProcedurestappen(procedurestappen: Procedurestap[]): ProcedurestapVM[] {
  return procedurestappen
    .filter(stap => stap.soortStap && stap.voltooidOp)
    .map(stap => ({
      soortStap: stap.soortStap,
      voltooidOp: new Date(stap.voltooidOp),
    }));
}

function mapOmgevingsvergunning(document: Omgevingsvergunning): DocumentVM {
  const geldigVanaf = new Date(document.geregistreerdMet.beginGeldigheid);
  return {
    documentId: document.identificatie,
    isOmgevingsvergunning: true,
    identificatie: document.publicatieID,
    type: document.type.waarde,
    geldigVanaf,
    statusDateLine: getRegelingStatusDateLine(document),
    inwerkingVanaf: new Date(document.geregistreerdMet.beginInwerking),
    bevoegdGezag: getBevoegdGezagOzon(document),
    title: document.officieleTitel,
    publicatie: document.publicatieID,
    locationHref: document._links?.heeftVergunningsgebied?.href,
    apiSource: ApiSource.OZON,
    subPages: [],
  };
}

function mapPlan(plan: Plan): DocumentVM {
  return {
    documentId: plan.id,
    isOmgevingsvergunning: false,
    identificatie: plan.id,
    type: plan.type.charAt(0).toUpperCase() + plan.type.slice(1),
    status: plan.planstatusInfo.planstatus,
    dossierStatus: plan.dossier?.status,
    geldigVanaf: new Date(plan.planstatusInfo.datum),
    statusDateLine: getPlanStatusDateLine(plan),
    bevoegdGezag: {
      naam: plan.beleidsmatigVerantwoordelijkeOverheid.naam ? plan.beleidsmatigVerantwoordelijkeOverheid.naam : '',
      code: getBevoegdGezagCode(
        plan.beleidsmatigVerantwoordelijkeOverheid.code,
        plan.beleidsmatigVerantwoordelijkeOverheid.type
      ),
      bestuurslaag: getBestuurslaag(plan.beleidsmatigVerantwoordelijkeOverheid.type),
    },
    title: plan.naam,
    isHistorisch: Boolean(plan.isHistorisch),
    isVerwijderdOp: plan.verwijderdOp,
    apiSource: ApiSource.IHR,
    subPages: getIhrSubPages(plan),
    hasDocumentStructure: plan.heeftOnderdelen?.some(onderdeel => onderdeel.heeftObjectgerichteTeksten.length),
    locationHref: `${plan._links.self.href}?expand=bbox`,
    extent: TransformGeometryService.transformGeometrieToOlGeometry(plan.bbox)?.getExtent(),
    ondergronden: plan.ondergronden,
    eindeRechtsgeldigheid: plan.eindeRechtsgeldigheid,
  };
}

function mapGerelateerdPlan(plan: GerelateerdPlan): DocumentVM {
  return {
    documentId: plan.id,
    isOmgevingsvergunning: false,
    identificatie: plan.id,
    type: plan.type.charAt(0).toUpperCase() + plan.type.slice(1),
    status: plan.planstatusInfo.planstatus,
    dossierStatus: plan.dossier?.status,
    geldigVanaf: new Date(plan.planstatusInfo.datum),
    statusDateLine: getPlanStatusDateLine(plan),
    bevoegdGezag: {
      naam: plan.beleidsmatigVerantwoordelijkeOverheid.naam ? plan.beleidsmatigVerantwoordelijkeOverheid.naam : '',
      code: undefined,
      bestuurslaag: undefined,
    },
    title: plan.naam,
    isHistorisch: Boolean(plan.isHistorisch),
    isVerwijderdOp: plan.verwijderdOp,
    apiSource: ApiSource.IHR,
    subPages: [],
    locationHref: `${plan._links.self.href}?expand=bbox`,
  };
}

function getBevoegdGezagCode(code: string, bestuurstype: string): string {
  switch (bestuurstype) {
    case BestuurslaagExtern.DEELGEMEENTE_STADSDEEL:
    case BestuurslaagExtern.GEMEENTELIJKE_OVERHEID:
      return `gm${code}`;
    case BestuurslaagExtern.PROVINCIALE_OVERHEID:
      return `pv${code}`;
    default:
      return code;
  }
}

function getBevoegdGezagOzon(document: Regeling | OntwerpRegeling | Omgevingsvergunning): BevoegdGezagVM {
  return {
    naam: document.aangeleverdDoorEen.naam,
    code: document.aangeleverdDoorEen.code,
    bestuurslaag: getBestuurslaag(document.aangeleverdDoorEen.bestuurslaag),
  };
}

function getBestuurslaag(bestuurstype: string): Bestuurslaag {
  // Ozon "rijk", "waterschap", "provincie", "gemeente" en "ministerie"
  // IHR "gemeentelijke overheid" "deelgemeente/stadsdeel" "provinciale overheid" "nationale overheid"

  switch (bestuurstype) {
    case BestuurslaagExtern.GEMEENTE:
    case BestuurslaagExtern.GEMEENTELIJKE_OVERHEID:
    case BestuurslaagExtern.DEELGEMEENTE_STADSDEEL:
      return Bestuurslaag.GEMEENTE;
    case BestuurslaagExtern.PROVINCIE:
    case BestuurslaagExtern.PROVINCIALE_OVERHEID:
      return Bestuurslaag.PROVINCIE;
    case BestuurslaagExtern.WATERSCHAP:
      return Bestuurslaag.WATERSCHAP;
    case BestuurslaagExtern.RIJK:
    case BestuurslaagExtern.MINISTERIE:
    case BestuurslaagExtern.NATIONALE_OVERHEID:
      return Bestuurslaag.RIJK;
    default:
      return Bestuurslaag.GEMEENTE;
  }
}

function getOzonSubPages(document: Regeling | OntwerpRegeling | Omgevingsvergunning): DocumentSubPage[] {
  return documentPages[getNormalizedDocumentTypeKey(document.type.waarde)];
}

function getPlanStatusDateLine(plan: Plan | GerelateerdPlan): string {
  const output = `${plan.planstatusInfo.planstatus} ${formattedDate(new Date(plan.planstatusInfo.datum))}`;
  // als het document een IHR plan is, moet na de datum de dossierstatus vermeld worden
  return plan.dossier?.status ? `${output} - ${plan.dossier?.status}` : output;
}

function getRegelingStatusDateLine(document: Regeling | Omgevingsvergunning): string {
  /* Standaard */
  if (document.geregistreerdMet.beginInwerking) {
    return `In werking vanaf ${formattedDate(new Date(document.geregistreerdMet.beginInwerking))}`;
  } else {
    /* Als er geen 'inwerking vanaf' is */
    return `Geldig vanaf ${formattedDate(new Date(document.geregistreerdMet.beginGeldigheid))}`;
  }
}

function getOntwerpRegelingStatusDateLine(bekendOp: Date, ontvangenOp: Date): string {
  /* Standaard */
  if (bekendOp) {
    return `Bekend op ${formattedDate(new Date(bekendOp))}`;
  } else {
    /* Als er geen 'bekend op' is */
    return `Ontvangen op ${formattedDate(new Date(ontvangenOp))}`;
  }
}

export function getIhrSubPages(plan: Plan): DocumentSubPage[] {
  let pages: DocumentSubPage[] = [];
  let objectPages: DocumentSubPage[] = [];

  if (plan.heeftOnderdelen?.length) {
    /* verzamel subpages, zoals Regels, Bijlagen en Toelichtingen aan de hand van 'objectgerichte teksten' */
    const objectgerichteTeksten = plan.heeftOnderdelen.map(onderdeel => onderdeel.heeftObjectgerichteTeksten).flat();
    objectPages = objectgerichteTeksten.map(item => ({
      path: normalizeString(item.type) as DocumentSubPagePath,
      label: item.titel,
      href: item.href,
    }));
    if (objectPages.length) {
      pages = objectPages.filter(page => documentPages[DocumentType.ihr].some(item => item.path === page.path));
    }
  }

  /* Als er objectgerichte tekst onderdelen zijn dan 'overig' toevoegen en anders 'inhoud' */
  objectPages.length ? pages.push(DocumentSubPages.overig) : pages.push(DocumentSubPages.inhoud);

  pages.push(DocumentSubPages.kaartLocatieDetails);
  pages.push(DocumentSubPages.gerelateerd);
  pages.push(DocumentSubPages.kaarten);

  /* sorteer de pages op basis van de volgorde in documentPages[DocumentType.ihr].pages */
  const pathSortOrder = documentPages[DocumentType.ihr].map(page => page.path);
  pages.sort(function (a, b) {
    return pathSortOrder.indexOf(a.path) - pathSortOrder.indexOf(b.path);
  });
  return pages;
}
