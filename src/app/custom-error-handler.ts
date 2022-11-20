import { ErrorHandler, Injectable } from '@angular/core';
import { ErrorMessage } from '~model/error-message';

@Injectable()
export class CustomErrorHandler extends ErrorHandler {
  constructor() {
    super();
  }

  public handleError(error: ErrorMessage | undefined): void {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}
