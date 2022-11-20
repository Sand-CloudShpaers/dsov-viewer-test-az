import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { IhrProvider } from '~providers/ihr.provider';
import { IhrPlannenService } from './ihr-plannen.service';
import * as fromFilter from '~viewer/filter/+state/filter.reducer';
import { ApiSource } from '~model/internal/api-source';
import { createIhrPlanMock } from '~mocks/documenten.mock';
import { RegelsbeleidType, RegelStatus, RegelStatusType } from '~model/regel-status.model';
import { FilterOptions } from '~viewer/filter/types/filter-options';
import { Bestuurslaag } from '~viewer/documenten/types/documenten.model';

describe('IhrPlannenService', () => {
  let service: IhrPlannenService;
  const filterOptions = {
    ...fromFilter.initialState.filterOptions,
    regelsbeleid: [RegelStatusType[RegelStatus.Geldend]],
  };

  const plan = createIhrPlanMock();
  const validResponse = {
    _embedded: {
      plannen: [plan],
    },
  };
  const spyOnDispatch = jasmine.createSpy('dispatch');
  const spyOnCreateIhrplannenUrl = jasmine.createSpy('createIhrplannenUrl');

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        IhrPlannenService,
        { provide: Store, useValue: { dispatch: spyOnDispatch } },
        {
          provide: IhrProvider,
          useValue: {
            createIhrplannenUrl: spyOnCreateIhrplannenUrl,
            fetchIhrplannenByUrl$: () =>
              of({
                ...validResponse,
                _links: { next: { href: 'https://testurl' } },
              }),
          },
        },
      ],
    });
    service = TestBed.inject(IhrPlannenService);
  });

  it('should exist', () => {
    expect(service).toBeTruthy();
  });

  describe('loadDocsByGeometry$', () => {
    it('loadDocsByGeometry', done => {
      service.loadDocsByGeometry$(filterOptions, null).subscribe(result => {
        expect(result).toEqual([plan]);
        done();
      });
    });

    it('should load docs with regelBinding "burgerbindend" or "instructieregel"', done => {
      const filter: FilterOptions = {
        ...filterOptions,
        regelsbeleid: [RegelStatusType[RegelStatus.Geldend], RegelsbeleidType['regels']],
        datum: [{ timeTravelDate: '2022-12-13', name: 'tijdreizen', id: 'timetravel' }],
      };
      service.loadDocsByGeometry$(filter, null).subscribe(_ => {
        expect(spyOnCreateIhrplannenUrl).toHaveBeenCalledWith(
          '?pageSize=20&regelStatus=geldend&beschikbaarOp=2022-12-13T12:00:00Z&regelBinding=burgerbindend,instructieregels&expand=bbox'
        );
        done();
      });
    });

    it('should load docs with regelBinding "beleid', done => {
      const filter: FilterOptions = {
        ...filterOptions,
        regelsbeleid: [RegelStatusType[RegelStatus.Geldend], RegelsbeleidType['beleid']],
      };
      service.loadDocsByGeometry$(filter, null).subscribe(_ => {
        expect(spyOnCreateIhrplannenUrl).toHaveBeenCalledWith(
          '?pageSize=20&regelStatus=geldend&regelBinding=beleid&expand=bbox'
        );
        done();
      });
    });

    it('should load docs with regelBinding "burgerbindend" not "Omgevingswaarderegel"', done => {
      const filter: FilterOptions = {
        ...filterOptions,
        document_type: [{ id: 'bestemmingsplan', name: 'bestemmingsplan', applicableToSources: [ApiSource.IHR] }],
        regelgeving_type: [
          { id: 'burgerbindend', name: 'burgerbindend' },
          { id: 'Omgevingswaarderegel', name: 'Omgevingswaarderegel' },
        ],
      };
      service.loadDocsByGeometry$(filter, null).subscribe(_ => {
        expect(spyOnCreateIhrplannenUrl).toHaveBeenCalledWith(
          '?pageSize=20&planType=bestemmingsplan&regelBinding=burgerbindend&regelStatus=geldend&expand=bbox'
        );
        done();
      });
    });

    it('should load docs with regelBinding "instructieregels" when only "instructieregelTaakuitoefening" is selected', done => {
      const filter: FilterOptions = {
        ...filterOptions,
        document_type: [{ id: 'bestemmingsplan', name: 'bestemmingsplan', applicableToSources: [ApiSource.IHR] }],
        regelgeving_type: [{ id: 'instructieregelTaakuitoefening', name: 'instructieregelTaakuitoefening' }],
      };
      service.loadDocsByGeometry$(filter, null).subscribe(_ => {
        expect(spyOnCreateIhrplannenUrl).toHaveBeenCalledWith(
          '?pageSize=20&planType=bestemmingsplan&regelBinding=instructieregels&regelStatus=geldend&expand=bbox'
        );
        done();
      });
    });

    it('should load docs with regelBinding "instructieregels" when only "instructieregelInstrument" is selected', done => {
      const filter: FilterOptions = {
        ...filterOptions,
        document_type: [{ id: 'bestemmingsplan', name: 'bestemmingsplan', applicableToSources: [ApiSource.IHR] }],
        regelgeving_type: [{ id: 'instructieregelInstrument', name: 'instructieregelInstrument' }],
      };
      service.loadDocsByGeometry$(filter, null).subscribe(_ => {
        expect(spyOnCreateIhrplannenUrl).toHaveBeenCalledWith(
          '?pageSize=20&planType=bestemmingsplan&regelBinding=instructieregels&regelStatus=geldend&expand=bbox'
        );
        done();
      });
    });

    it(
      'should load docs with regelBinding "instructieregels" when both "instructieregelInstrument"' +
        ' and "instructieregelTaakuitoefening" are selected',
      done => {
        const filter: FilterOptions = {
          ...filterOptions,
          document_type: [{ id: 'bestemmingsplan', name: 'bestemmingsplan', applicableToSources: [ApiSource.IHR] }],
          regelgeving_type: [
            { id: 'instructieregelInstrument', name: 'instructieregelInstrument' },
            { id: 'instructieregelTaakuitoefening', name: 'instructieregelTaakuitoefening' },
          ],
        };
        service.loadDocsByGeometry$(filter, null).subscribe(_ => {
          expect(spyOnCreateIhrplannenUrl).toHaveBeenCalledWith(
            '?pageSize=20&planType=bestemmingsplan&regelBinding=instructieregels&regelStatus=geldend&expand=bbox'
          );
          done();
        });
      }
    );

    it('should load docs with pons true and regelBinding=burgerbindend,instructieregels', done => {
      const filter: FilterOptions = {
        ...filterOptions,
        regelsbeleid: [RegelStatusType[RegelStatus.Geldend], RegelsbeleidType['regels']],
      };
      service.loadDocsByGeometry$(filter, true, null).subscribe(_ => {
        expect(spyOnCreateIhrplannenUrl).toHaveBeenCalledWith(
          '?pageSize=20&regelStatus=geldend&regelBinding=burgerbindend,instructieregels&ponsOmgevingsplan=true&expand=bbox'
        );
        done();
      });
    });

    it('should not load docs with regelBinding "Omgevingswaarderegel"', done => {
      const filter: FilterOptions = {
        ...filterOptions,
        document_type: [{ id: 'bestemmingsplan', name: 'bestemmingsplan', applicableToSources: [ApiSource.IHR] }],
        regelgeving_type: [{ id: 'Omgevingswaarderegel', name: 'Omgevingswaarderegel' }],
      };
      service.loadDocsByGeometry$(filter, null).subscribe(result => {
        expect(result).toEqual([]);
        done();
      });
    });

    it('should not load docs when no IHR planType', done => {
      const filter: FilterOptions = {
        ...filterOptions,
        document_type: [{ id: 'omgevingsplan', name: 'omgevingsplan', applicableToSources: [ApiSource.OZON] }],
      };
      service.loadDocsByGeometry$(filter, null).subscribe(result => {
        expect(result).toEqual([]);
        done();
      });
    });
  });

  describe('loadMorePlannen', () => {
    it('should dispatch to correct action', done => {
      service.loadMorePlannen$('https://testurl', undefined, Bestuurslaag.GEMEENTE).subscribe(result => {
        expect(result).toEqual([plan]);
        expect(spyOnDispatch).toHaveBeenCalledWith({
          type: '[Plannen] IHR set NextUrl',
          bestuurslaag: Bestuurslaag.GEMEENTE,
          href: 'https://testurl',
        });
        done();
      });
    });
  });
});
