import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { MockComponent } from 'ng-mocks';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DocumentVersiesItemComponent } from './document-versies-item.component';

describe('DocumentVersiesVastgesteldComponent', () => {
  let spectator: Spectator<DocumentVersiesItemComponent>;

  const createComponent = createComponentFactory({
    component: DocumentVersiesItemComponent,
    imports: [],
    providers: [],
    declarations: [MockComponent(DocumentVersiesItemComponent)],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        documentVersie: {
          identificatie: 'id',
          versie: 1,
          geldigOp: {
            original: '12-12-2021',
            date: new Date('12-12-2021'),
          },
          inWerkingOp: {
            original: '12-12-2021',
            date: new Date('12-12-2021'),
          },
          beschikbaarOp: {
            original: '12-12-2021',
            date: new Date('12-12-2021'),
          },
          gepubliceerdOp: {
            original: '12-12-2021',
            date: new Date('12-12-2021'),
          },
        },
      },
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should set "isToekomstig" true', () => {
    spectator.component.ngOnInit();

    expect(spectator.component.isToekomstig).toBeFalse();
  });
});
