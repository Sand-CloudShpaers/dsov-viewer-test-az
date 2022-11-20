export interface AnnotatieHoofdlijnenVM {
  identificatie: string;
  naam: string;
  hoofdlijnen: AnnotatieHoofdlijnVM[];
}

export interface AnnotatieHoofdlijnVM {
  identificatie: string;
  naam: string;
  soort: string;
  isOntwerp?: boolean;
}
