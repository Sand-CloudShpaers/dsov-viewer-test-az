import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { OmgevingsvergunningComponent } from './omgevingsvergunning.component';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DocumentenFacade } from '~viewer/documenten/+state/documenten.facade';

describe('OmgevingsvergunningComponent', () => {
  let spectator: Spectator<OmgevingsvergunningComponent>;

  const createComponent = createComponentFactory({
    component: OmgevingsvergunningComponent,
    providers: [
      {
        provide: DocumentenFacade,
        useValue: {
          documentVM$: () => of('id'),
        },
      },
    ],
    declarations: [MockComponent(OmgevingsvergunningComponent)],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
