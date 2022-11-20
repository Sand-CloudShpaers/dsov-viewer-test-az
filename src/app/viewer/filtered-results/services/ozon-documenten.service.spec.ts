import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { OzonProvider } from '~providers/ozon.provider';
import { OzonDocumentenService } from './ozon-documenten.service';
import { createRegelingMock } from '~mocks/documenten.mock';
import { Omgevingsvergunningen } from '~ozon-model/omgevingsvergunningen';

describe('OzonDocumentenService', () => {
  let service: OzonDocumentenService;

  const omgevingsdocument = createRegelingMock();
  const locaties = ['id'];
  const validResponse = {
    _embedded: {
      regelingen: [omgevingsdocument],
    },
  };
  const mockOmgevingsvergunningen: Omgevingsvergunningen = {
    _embedded: {
      omgevingsvergunningen: [],
    },
    _links: null,
    page: null,
  };
  const spyOnDispatch = jasmine.createSpy('spyOnDispatch');

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        OzonDocumentenService,
        { provide: Store, useValue: { dispatch: spyOnDispatch } },
        {
          provide: OzonProvider,
          useValue: {
            fetchRegelingen$: () => of(validResponse),
            fetchRegelingenByUrl$: () =>
              of({
                ...validResponse,
                _links: { next: { href: 'https://testurl' } },
              }),
            fetchOmgevingsvergunningen$: () => of(mockOmgevingsvergunningen),
          },
        },
      ],
    });
    service = TestBed.inject(OzonDocumentenService);
  });

  it('should exist', () => {
    expect(service).toBeTruthy();
  });

  describe('loadOzonDocuments', () => {
    it('should return documents', done => {
      const filterState = { document_type: [{ applicableToSources: ['OZON'] }] };
      service.loadOzonDocumenten$(locaties, filterState as any, true).subscribe(result => {
        expect(result).toEqual([[omgevingsdocument], [omgevingsdocument], []]);
        done();
      });
    });

    it('should return no documents for beleid with activity', done => {
      const filterState = { activiteit: ['dummyActiviteit'], document_type: [{ applicableToSources: ['OZON'] }] };
      service.loadVrijeTekstDocumenten$(locaties, filterState as any, true).subscribe(result => {
        expect(result).toEqual([]);
        done();
      });
    });

    it('should return no documents for a documenttype unknown to OZON', done => {
      const filterState = { document_type: [{ applicableToSources: ['IHR'] }] };
      service.loadRegeltekstDocumenten$(locaties, filterState as any, true).subscribe(result => {
        expect(result).toEqual([]);
        done();
      });
    });
  });

  it('loadMore', done => {
    service.loadMore$('test', undefined, null).subscribe(result => {
      expect(result).toEqual([omgevingsdocument]);
      expect(spyOnDispatch).toHaveBeenCalledWith({
        type: '[Plannen] Ozon LoadMore',
        fetchUrl: 'https://testurl',
        ozonLocaties: undefined,
        filterOptions: null,
      });
      done();
    });
  });
});
