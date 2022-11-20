export interface DocumentVersieVM {
  identificatie: string;
  versie: number;
  geldigOp: DateAttributes;
  inWerkingOp: DateAttributes;
  beschikbaarOp: DateAttributes;
  gepubliceerdOp: DateAttributes;
}

interface DateAttributes {
  original: string;
  date: Date;
}
