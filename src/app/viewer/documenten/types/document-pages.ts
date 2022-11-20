import { DocumentType } from '~viewer/documenten/types/document-types';

export enum DocumentSubPagePath {
  PROJECTBESLUIT = 'projectbesluit',
  BELEID = 'beleid',
  REGELS = 'regels',
  TOELICHTING = 'toelichting',
  BIJLAGEN = 'bijlagen',
  BIJLAGE = 'bijlage',
  KAARTEN = 'kaarten',
  INHOUD = 'inhoud',
  OVERIG = 'overig',
  BIJLAGENBIJREGELS = 'bijlagenbijregels',
  BIJLAGENBIJTOELICHTING = 'bijlagenbijtoelichting',
  BELEIDSTEKST = 'beleidstekst',
  BESLUITDOCUMENT = 'besluitdocument',
  BESLUITTEKST = 'besluittekst',
  DEEL = 'deel',
  LOCATIEDETAILS = 'locatiedetails',
  GERELATEERD = 'gerelateerd',
  THEMAS = 'themas',
}

export const DocumentSubPages = {
  themas: {
    path: DocumentSubPagePath.THEMAS,
    label: "Thema's",
  },
  projectbesluit: {
    path: DocumentSubPagePath.PROJECTBESLUIT,
    label: 'Projectbesluit',
  },
  beleid: {
    path: DocumentSubPagePath.BELEID,
    label: 'Beleid',
  },
  regels: {
    path: DocumentSubPagePath.REGELS,
    label: 'Regels',
  },
  toelichting: {
    path: DocumentSubPagePath.TOELICHTING,
    label: 'Toelichting',
  },
  bijlagen: {
    path: DocumentSubPagePath.BIJLAGEN,
    label: 'Bijlagen',
  },
  bijlage: {
    path: DocumentSubPagePath.BIJLAGE,
    label: 'Bijlagen',
  },
  kaarten: {
    path: DocumentSubPagePath.KAARTEN,
    label: 'Kaarten',
  },
  inhoud: {
    path: DocumentSubPagePath.INHOUD,
    label: 'Inhoud',
  },
  overig: {
    path: DocumentSubPagePath.OVERIG,
    label: 'Overig',
  },
  bijlagenBijRegels: {
    path: DocumentSubPagePath.BIJLAGENBIJREGELS,
    label: 'Bijlagen bij regels',
  },
  bijlagenBijToelichting: {
    path: DocumentSubPagePath.BIJLAGENBIJTOELICHTING,
    label: 'Bijlagen bij toelichting',
  },
  beleidstekst: {
    path: DocumentSubPagePath.BELEIDSTEKST,
    label: 'Beleidstekst',
  },
  besluitdocument: {
    path: DocumentSubPagePath.BESLUITDOCUMENT,
    label: 'Besluitdocument',
  },
  besluittekst: {
    path: DocumentSubPagePath.BESLUITTEKST,
    label: 'Besluittekst',
  },
  deel: {
    path: DocumentSubPagePath.DEEL,
    label: 'Deel',
  },
  kaartLocatieDetails: {
    path: DocumentSubPagePath.LOCATIEDETAILS,
    label: 'Details op locatie',
  },
  gerelateerd: {
    path: DocumentSubPagePath.GERELATEERD,
    label: 'Gerelateerd',
  },
};

export const documentPages: Readonly<DocumentPages> = {
  [DocumentType.projectBesluit]: [
    DocumentSubPages.inhoud,
    DocumentSubPages.beleid,
    DocumentSubPages.bijlage,
    DocumentSubPages.kaarten,
  ],
  [DocumentType.omgevingsVisie]: [
    DocumentSubPages.inhoud,
    DocumentSubPages.beleid,
    DocumentSubPages.bijlage,
    DocumentSubPages.kaarten,
  ],
  [DocumentType.ministerieleRegeling]: [
    DocumentSubPages.inhoud,
    DocumentSubPages.regels,
    DocumentSubPages.toelichting,
    DocumentSubPages.bijlage,
    DocumentSubPages.kaarten,
  ],
  [DocumentType.omgevingsPlan]: [
    DocumentSubPages.inhoud,
    DocumentSubPages.regels,
    DocumentSubPages.toelichting,
    DocumentSubPages.bijlage,
    DocumentSubPages.kaarten,
  ],
  [DocumentType.waterschapsverordening]: [
    DocumentSubPages.inhoud,
    DocumentSubPages.regels,
    DocumentSubPages.bijlage,
    DocumentSubPages.toelichting,
    DocumentSubPages.kaarten,
  ],
  [DocumentType.amvb]: [
    DocumentSubPages.inhoud,
    DocumentSubPages.regels,
    DocumentSubPages.toelichting,
    DocumentSubPages.bijlage,
    DocumentSubPages.kaarten,
  ],
  [DocumentType.omgevingsverordening]: [
    DocumentSubPages.inhoud,
    DocumentSubPages.regels,
    DocumentSubPages.toelichting,
    DocumentSubPages.bijlage,
    DocumentSubPages.kaarten,
  ],
  [DocumentType.instructie]: [
    DocumentSubPages.inhoud,
    DocumentSubPages.beleid,
    DocumentSubPages.bijlage,
    DocumentSubPages.kaarten,
  ],
  [DocumentType.voorbeschermingsregels]: [
    DocumentSubPages.inhoud,
    DocumentSubPages.regels,
    DocumentSubPages.toelichting,
    DocumentSubPages.bijlage,
    DocumentSubPages.kaarten,
  ],
  [DocumentType.aanwijzingsbesluitn2000]: [
    DocumentSubPages.inhoud,
    DocumentSubPages.regels,
    DocumentSubPages.toelichting,
    DocumentSubPages.bijlage,
    DocumentSubPages.kaarten,
  ],
  [DocumentType.toegangsbeperkingsbesluit]: [
    DocumentSubPages.inhoud,
    DocumentSubPages.regels,
    DocumentSubPages.toelichting,
    DocumentSubPages.bijlage,
    DocumentSubPages.kaarten,
  ],
  [DocumentType.programma]: [
    DocumentSubPages.inhoud,
    DocumentSubPages.beleid,
    DocumentSubPages.toelichting,
    DocumentSubPages.bijlage,
    DocumentSubPages.kaarten,
  ],
  [DocumentType.ihr]: [
    DocumentSubPages.inhoud,
    DocumentSubPages.regels,
    DocumentSubPages.bijlagenBijRegels,
    DocumentSubPages.besluitdocument,
    DocumentSubPages.besluittekst,
    DocumentSubPages.beleidstekst,
    DocumentSubPages.deel,
    DocumentSubPages.toelichting,
    DocumentSubPages.bijlagenBijToelichting,
    DocumentSubPages.bijlagen,
    DocumentSubPages.gerelateerd,
    DocumentSubPages.kaarten,
    DocumentSubPages.overig,
    DocumentSubPages.kaartLocatieDetails,
  ],
};

interface DocumentPages {
  [key: string]: DocumentSubPage[];
}

export interface DocumentSubPage {
  path: DocumentSubPagePath;
  label: string;
  href?: string;
}
