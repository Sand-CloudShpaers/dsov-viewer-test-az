import { ErrorHandler, Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorMessage } from '~model/error-message';
import { DisplayErrorInfoMessagesService } from '~services/display-error-info-messages.service';

const HTTP = {
  NOT_FOUND: 404,
};

@Injectable()
export class ErrorHandlingService {
  constructor(
    private customErrorHandler: ErrorHandler,
    private displayErrorInfoMessagesService: DisplayErrorInfoMessagesService
  ) {}

  private static constructErrorMessage(apiName: string, error: ErrorMessage): ErrorMessage {
    const text: Record<string, string> = {
      parcel: 'U kunt geen percelen ophalen op dit moment. Zoek op een andere manier of probeer het later nog eens.',
      location: 'U kunt geen adressen ophalen op dit moment. Zoek via de kaart of probeer het later nog eens.',
      object: 'U kunt geen objectinformatie ophalen op dit moment. Probeer het later nog eens.',
      DSOcatalogus: 'U kunt uw zoekopdracht niet filteren op dit moment. Probeer het later nog eens.',
      InformatiehuisRuimte: 'U kunt geen ruimtelijke plannen ophalen op dit moment. Probeer het later nog eens.',
      DSOLV: 'U kunt geen omgevingsdocumenten ophalen op dit moment. Probeer het later nog eens.',
      CMS: 'De helptekst is momenteel niet beschikbaar. Probeer het later nog eens.',
    };
    const key = apiName.replace('-', '').replace(' ', '');
    let messageText = text[key];
    if (messageText === undefined) {
      messageText =
        'U kunt niet alle gegevens ophalen op dit moment. De getoonde informatie is niet compleet. Probeer het later nog eens.';
    }

    const errorMessage: ErrorMessage = {
      message: messageText,
      status: ErrorHandlingService.getStatus(error),
      info: {
        API: apiName,
        Status: ErrorHandlingService.getStatus(error),
        Melding: ErrorHandlingService.getMelding(error),
        Tijdstip: new Date().toLocaleString(),
      },
    };
    return errorMessage;
  }

  private static getStatus(error: ErrorMessage): number {
    if (error && error.status) {
      return error.status;
    } else {
      return 0;
    }
  }

  private static getMelding(error: ErrorMessage): string {
    if (error && error.message) {
      return error.message;
    } else {
      return 'onbekend';
    }
  }

  public handleApiCallError$<T>(observable: Observable<T>, apiName: string, defaultValue?: T): Observable<T> {
    return observable.pipe(
      catchError(error => {
        if (error.error instanceof Error || error.status !== HTTP.NOT_FOUND) {
          this.logError(error);
          this.displayError(apiName, error);
        }
        return defaultValue ? of(defaultValue) : throwError(() => error);
      })
    );
  }

  public handleError(error: ErrorMessage | undefined): void {
    this.displayErrorInfoMessagesService.error(error);
    this.customErrorHandler.handleError(error);
  }

  private displayError(apiName: string, error: ErrorMessage): void {
    this.displayErrorInfoMessagesService.error(ErrorHandlingService.constructErrorMessage(apiName, error));
  }

  private logError(error: ErrorMessage): void {
    this.customErrorHandler.handleError(error);
  }
}
