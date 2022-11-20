import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { MockComponent } from 'ng-mocks';
import { AlertComponent } from './alert.component';

describe('AlertComponent', () => {
  let spectator: Spectator<AlertComponent>;
  const createComponent = createComponentFactory({
    component: AlertComponent,
    declarations: [MockComponent(AlertComponent)],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should show message, when message', () => {
    spectator.setInput('error', new Error('error'));
    spectator.detectChanges();

    expect(spectator.query('[data-test-id="search-alert__message"]').innerHTML).toEqual('error');
  });
});
