export class ErrorMessage {
  public message: string;
  public status: number;
  public info?: {
    API: string;
    Status: number;
    Melding: string;
    Tijdstip: string;
  };
}

export interface MessagePayload {
  type: string;
  message: string;
  info?: {
    API?: string;
    Status?: number;
    Melding?: string;
    Tijdstip?: string;
  };
}
