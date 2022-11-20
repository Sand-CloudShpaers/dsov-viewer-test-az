import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { DocumentenFacade } from './documenten.facade';
import { themasMock } from '~viewer/documenten/+state/themas/themas.selectors.spec';
import { OmgevingsDocumentService } from '../services/omgevings-document.service';

describe('DocumentenFacade', () => {
  let documentenFacade: DocumentenFacade;

  const initialState = {
    documenten: {
      themas: {
        entities: {
          test: {
            data: themasMock,
            entityId: 'test',
          },
          ids: 'test',
        },
      },
    },
  } as any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DocumentenFacade,
        OmgevingsDocumentService,
        provideMockStore({
          initialState,
        }),
      ],
    });
    documentenFacade = TestBed.inject(DocumentenFacade);
  });

  it('should be created', () => {
    expect(documentenFacade).toBeTruthy();
  });

  it('sortedThemasByDocumentId', async () => {
    documentenFacade.sortedThemasByDocumentId$('test').subscribe(result => {
      expect(result as any).toEqual([
        { code: '001', waarde: 'Thema 1' },
        { code: '002', waarde: 'Thema 2' },
        { code: '003', waarde: 'Thema 3' },
      ]);
    });
  });
});
