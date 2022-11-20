import { Extent } from 'ol/extent';
import { ApiSource } from '~model/internal/api-source';
import { DerivedLoadingState } from '~general/utils/store.utils';
import { DocumentSubPage } from './document-pages';
import { DocumentElementenLayoutVM } from './layout.model';
import { AnnotationVM } from './annotation';
import { PlanOndergrondenInner } from '~ihr-model/planOndergrondenInner';

export interface DocumentVM {
  documentId: string;
  isOntwerp?: boolean;
  isOmgevingsvergunning?: boolean;
  apiSource: ApiSource;
  loadingState?: DerivedLoadingState;
  subPages: DocumentSubPage[];
  hasDocumentStructure?: boolean;
  identificatie?: string;
  ozonOntwerpbesluitId?: string;
  technischId?: string;
  title: string;
  statusDateLine: string;
  status?: string;
  dossierStatus?: string; // IHR
  geldigVanaf?: Date;
  inwerkingVanaf?: Date;
  bekendOp?: Date;
  ontvangenOp?: Date;
  type: string;
  bevoegdGezag: BevoegdGezagVM;
  opschrift?: string;
  isVerwijderdOp?: string; // IHR
  isHistorisch?: boolean; // IHR
  eindeRechtsgeldigheid?: string;
  tijdelijkeDelen?: DocumentVM[];
  publicatie?: string;
  ontwerpBesluitPublicatie?: string;
  errorStatus?: number;
  linkToDocument?: string;
  locationHref?: string;
  extent?: Extent;
  procedurestappen?: ProcedurestapVM[]; // OZON, ontwerpregelingen
  ondergronden?: PlanOndergrondenInner[]; // IHR, ruimtelijke plannen
}

export interface BevoegdGezagVM {
  naam: string;
  code: string;
  bestuurslaag: Bestuurslaag;
}

export enum Bestuurslaag {
  GEMEENTE = 'gemeente',
  PROVINCIE = 'provincie',
  WATERSCHAP = 'waterschap',
  RIJK = 'rijk',
}

export enum BestuurslaagExtern {
  DEELGEMEENTE_STADSDEEL = 'deelgemeente/stadsdeel',
  GEMEENTELIJKE_OVERHEID = 'gemeentelijke overheid',
  GEMEENTE = 'gemeente',
  PROVINCIALE_OVERHEID = 'provinciale overheid',
  PROVINCIE = 'provincie',
  WATERSCHAP = 'waterschap',
  NATIONALE_OVERHEID = 'nationale overheid',
  RIJK = 'rijk',
  MINISTERIE = 'ministerie',
}

export const bestuurslagen = {
  [Bestuurslaag.GEMEENTE]: [
    BestuurslaagExtern.GEMEENTELIJKE_OVERHEID,
    BestuurslaagExtern.DEELGEMEENTE_STADSDEEL,
    BestuurslaagExtern.GEMEENTE,
  ],
  [Bestuurslaag.PROVINCIE]: [BestuurslaagExtern.PROVINCIALE_OVERHEID, BestuurslaagExtern.PROVINCIE],
  [Bestuurslaag.WATERSCHAP]: [BestuurslaagExtern.WATERSCHAP],
  [Bestuurslaag.RIJK]: [BestuurslaagExtern.NATIONALE_OVERHEID, BestuurslaagExtern.RIJK, BestuurslaagExtern.MINISTERIE],
};

export interface DocumentBodyElementTitle {
  content?: string;
  prefix?: string;
  suffix?: string;
}

export interface DocumentBodyElement {
  id: string;
  documentId: string;
  layout: DocumentElementenLayoutVM;
  hasChildren: boolean;
  apiSource: ApiSource;
  breadcrumbs: Breadcrumb[];
  isOntwerp: boolean;
  isGereserveerd: boolean;
  isVervallen: boolean;
  nummer?: string;
  titel?: DocumentBodyElementTitle;
  niveau?: number;
  inhoud?: string;
  annotationLink?: string;
  annotation?: AnnotationVM;
  type?: DocumentBodyElementType;
  elementen?: DocumentBodyElement[];
  externeReferentieLinkIHR?: string;
}

export interface Breadcrumb {
  id: string;
  titel: string;
}

export enum DocumentBodyElementType {
  AANHEF = 'AANHEF',
  AFDELING = 'AFDELING',
  ALGEMENE_TOELICHTING = 'ALGEMENE_TOELICHTING',
  ARTIKEL = 'ARTIKEL',
  ARTIKELGEWIJZE_TOELICHTING = 'ARTIKELGEWIJZE_TOELICHTING',
  BIJLAGE = 'BIJLAGE',
  BEGRIP = 'BEGRIP',
  BOEK = 'BOEK',
  CONDITIEARTIKEL = 'CONDITIEARTIKEL',
  DEEL = 'DEEL',
  DIVISIE = 'DIVISIE',
  DIVISIETEKST = 'DIVISIETEKST',
  HOOFDSTUK = 'HOOFDSTUK',
  LICHAAM = 'LICHAAM',
  LID = 'LID',
  PARAGRAAF = 'PARAGRAAF',
  PLATTE_TEKST = 'PLATTE-TEKST',
  SLUITING = 'SLUITING',
  SUBPARAGRAAF = 'SUBPARAGRAAF',
  SUBSUBPARAGRAAF = 'SUBSUBPARAGRAAF',
  TITEL = 'TITEL',
  TOELICHTING = 'TOELICHTING',
}

export interface InhoudVM {
  onderdelen: InhoudLinkVM[];
  verwijzingNaarVaststellingsbesluit: string;
  verwijzingNaarGml: string;
  illustraties: InhoudLinkVM[];
}

export interface InhoudLinkVM {
  href: string;
  type: string;
}

export interface DocumentStructuurVM {
  elementen: DocumentBodyElement[];
}

export interface ProcedurestapVM {
  soortStap: {
    code: string;
    waarde: string;
  };
  voltooidOp: Date;
}
