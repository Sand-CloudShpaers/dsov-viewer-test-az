export interface OpenbaarLichaam {
  bestuurslaag: string;
  code: string;
  naam: string;
  type: string;
}

export interface OpenbareLichamen {
  _embedded: OpenbareLichamenEmbedded;
}

interface OpenbareLichamenEmbedded {
  openbareLichamen: OpenbaarLichaam[];
}
