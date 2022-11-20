import { AnnotatieHoofdlijnenVM } from '~viewer/annotaties/types/hoofdlijnen';

export const annotatieHoofdlijnenVMMock: AnnotatieHoofdlijnenVM = {
  identificatie: 'soort',
  naam: 'soort',
  hoofdlijnen: [
    {
      identificatie: 'id',
      naam: 'hoofdlijn',
      soort: 'soort',
      isOntwerp: false,
    },
  ],
};
