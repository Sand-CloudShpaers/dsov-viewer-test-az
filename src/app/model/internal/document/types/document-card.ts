import { RegelStatus } from '~model/regel-status.model';

export class DocumentCard {
  public title: string | null = null;
  public status: string | null = null;
  public geldigVanafDate?: Date | null = null;
  public regelStatus: RegelStatus;
  public dossierStatus: string | null = null;
  public type: string;
  public beleidsmatigVerantwoordelijkeOverheid: string[] = [];
  public verwijzingNaarVaststellingsbesluit?: string;
  public isHistorisch: boolean;
  public isVerwijderdOpDate?: Date | null = null;
}
