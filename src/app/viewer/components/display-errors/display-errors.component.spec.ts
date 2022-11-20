import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { of } from 'rxjs';
import { DisplayErrorInfoMessagesService } from '~services/display-error-info-messages.service';
import { DisplayErrorsComponent } from './display-errors.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('DisplayErrorsComponent', () => {
  let spectator: Spectator<DisplayErrorsComponent>;

  const createComponent = createComponentFactory({
    component: DisplayErrorsComponent,
    providers: [
      {
        provide: DisplayErrorInfoMessagesService,
        useValue: {
          errors$: of({
            message: 'message 1',
            status: 404,
          }),
        },
      },
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    spectator.fixture.detectChanges();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should display the error icon when errors have been displayed', () => {
    spectator.component.errorMessages$ = of({ messages: [], showErrorMessage: true });
    spectator.detectChanges();

    expect(spectator.queryAll('[data-test-id="show-error-icon"]').length).toBe(1);
  });

  it('should open the modal', () => {
    spectator.component.openModal();

    expect(spectator.component.modalOpen).toBeTrue();
  });

  it('should close the modal', () => {
    spectator.component.onCloseModal();

    expect(spectator.component.modalOpen).toBeFalse();
  });

  it('should sort the error messages and count', () => {
    expect(
      spectator.component.transformErrorsToDisplayMessages([
        {
          message: 'message 1',
          status: 404,
        },
        {
          message: 'message 2',
          status: 404,
        },
      ])
    ).toEqual([
      { message: 'message 2', status: 404 },
      { message: 'message 1', status: 404 },
    ]);
  });
});
