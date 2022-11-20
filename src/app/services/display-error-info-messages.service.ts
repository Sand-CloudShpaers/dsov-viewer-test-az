import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ErrorMessage, MessagePayload } from '~model/error-message';

@Injectable({
  providedIn: 'root',
})
export class DisplayErrorInfoMessagesService {
  private errorsSubject$ = new Subject<ErrorMessage>();
  public errors$ = this.errorsSubject$.asObservable();
  private warningsSubject$ = new Subject<string>();
  private messagesSubject$ = new Subject<MessagePayload>();
  public messages$ = this.messagesSubject$.asObservable();

  constructor() {
    this.displayErrors();
  }

  public warning(message = 'unknown warning'): void {
    this.warningsSubject$.next(message);
  }

  public error(errorMessage: ErrorMessage): void {
    this.errorsSubject$.next(errorMessage);
  }

  private displayErrors(): void {
    this.errors$.subscribe(message => {
      this.messagesSubject$.next({ type: 'error', message: message.message, info: message.info || {} });
    });
  }
}
