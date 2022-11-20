import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { RegelsOpMaatComponent } from './regels-op-maat.component';
import { RegelsOpMaatFacade } from '~viewer/regels-op-maat/+state/regels-op-maat.facade';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { RegelsOpMaatDocument } from '~viewer/regels-op-maat/types/regels-op-maat-document';
import { DerivedLoadingState } from '~general/utils/store.utils';

describe('RegelsOpMaatComponent', () => {
  let spectator: Spectator<RegelsOpMaatComponent>;

  const regelsOpMaatDocument: RegelsOpMaatDocument = {
    documentId: 'documentId',
    documentType: 'Regeling',
    regelteksten: [],
    ontwerpRegelteksten: [],
    divisieannotaties: [],
    ontwerpDivisieannotaties: [],
    teksten: [],
  };

  const derivedLoadinState: DerivedLoadingState = {
    isLoading: false,
    isIdle: false,
    isPending: false,
    isResolved: true,
    isRejected: false,
    isLoaded: true,
  };

  const createComponent = createComponentFactory({
    component: RegelsOpMaatComponent,
    providers: [
      {
        provide: RegelsOpMaatFacade,
        useValue: {
          documentStatus$: () => of(derivedLoadinState),
          selectRegelsOpMaatDocument$: () => of(regelsOpMaatDocument),
        },
      },
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        documentId: 'documentId',
      },
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
