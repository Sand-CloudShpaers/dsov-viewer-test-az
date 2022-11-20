export interface DocumentDto {
  documentId: string; // is documentIdentificatie (bij vastgesteld), technischId (bij ontwerp), of id (bij IHR)
  documentType?: string;
}
