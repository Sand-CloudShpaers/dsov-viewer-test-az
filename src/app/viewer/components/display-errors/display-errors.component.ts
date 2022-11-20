import { Component } from '@angular/core';
import { map, scan } from 'rxjs/operators';
import { DisplayErrorMessage } from '~model/display-error-message';
import { ErrorMessage } from '~model/error-message';
import { DisplayErrorInfoMessagesService } from '~services/display-error-info-messages.service';

@Component({
  selector: 'dsov-display-errors',
  templateUrl: './display-errors.component.html',
  styleUrls: ['./display-errors.component.scss'],
})
export class DisplayErrorsComponent {
  public modalOpen = false;
  public errorMessages$ = this.displayErrorMessagesService.errors$.pipe(
    scan((result, errorMessage) => {
      const unfilteredErrorMessages = [...result, errorMessage];
      return this.transformErrorsToDisplayMessages(unfilteredErrorMessages);
    }, [] as DisplayErrorMessage[]),
    map(messages => ({ messages, showErrorMessage: messages.length > 0 }))
  );

  constructor(private displayErrorMessagesService: DisplayErrorInfoMessagesService) {}

  public openModal(): void {
    this.modalOpen = true;
  }

  public onCloseModal(): void {
    this.modalOpen = false;
  }

  public transformErrorsToDisplayMessages(errors: ErrorMessage[]): DisplayErrorMessage[] {
    // create a non-destructive sort
    const sortedErrors = [...errors].sort((a, b) => (b.message > a.message ? 1 : b.message < a.message ? -1 : 0));
    return sortedErrors;
  }
}
