import { ErrorMessage, MessagePayload } from './error-message';

export interface DisplayErrorMessage extends ErrorMessage {
  showinfo?: boolean;
}

export interface DisplayMessagePayload extends MessagePayload {
  id: number;
  showinfo: boolean;
  infohtml?: string;
  /**
   * setTimeout() return id
   */
  timeout: number;
}
