import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Plan } from '~ihr-model/plan';
import { IhrRegelStatus, RegelStatus } from '~model/regel-status.model';
import { ApiSource } from '~model/internal/api-source';
import { formattedDateTime } from '~general/utils/date.utils';
import { IhrProvider } from '~providers/ihr.provider';
import { State } from '~store/state';
import { FilterName, FilterOptions, LocatieFilter } from '~viewer/filter/types/filter-options';
import * as PlannenActions from '~viewer/filtered-results/+state/plannen/plannen.actions';
import { mapRegelStatusToIhrRegelStatus } from '~viewer/filtered-results/helpers/regelstatus';
import { Bestuurslaag } from '~viewer/documenten/types/documenten.model';

interface IHRDocsQueryParams {
  filterOptions?: FilterOptions;
  gemeentecode?: string;
  isBeleid?: boolean;
  ponsOmgevingsplan?: boolean;
  regelStatus?: RegelStatus;
  bestuurslaag: Bestuurslaag;
}

const IHR_PAGE_SIZE = 20;

@Injectable()
export class IhrPlannenService {
  constructor(private provider: IhrProvider, private store: Store<State>) {}

  private static getQueryParams(params: IHRDocsQueryParams): HttpParams {
    let parameters = new HttpParams({ fromString: `pageSize=${IHR_PAGE_SIZE}` });

    const options = params.filterOptions;
    if (options) {
      if (options[FilterName.DOCUMENT_TYPE].length > 0) {
        parameters = parameters.set('planType', options[FilterName.DOCUMENT_TYPE][0].id);
        const ihrDocumentTypes = options[FilterName.DOCUMENT_TYPE].filter(documenttype =>
          documenttype.applicableToSources?.includes(ApiSource.IHR)
        );
        if (ihrDocumentTypes.length > 0) {
          parameters = parameters.set('planType', ihrDocumentTypes.map(documenttype => documenttype.id).join());
        } else {
          return null;
        }
      }

      // Als er een filter voor regelgevingtype is ingesteld, dan deze heeft voorrang
      if (options[FilterName.REGELGEVING_TYPE].length > 0) {
        // Indien er minimaal 1 instructieRegel is geselecteerd dan slechts 1x instructieregels toevoegen aan
        // regelBinding, daarom wordt de array uniek gemaakt middels de Set
        const parameterValue = [
          ...new Set(
            options[FilterName.REGELGEVING_TYPE].map(r => {
              if (['instructieregelInstrument', 'instructieregelTaakuitoefening'].includes(r.id)) {
                return 'instructieregels';
              }
              return r.id;
            })
          ),
        ];
        parameters = parameters.set('regelBinding', parameterValue.join());
      }

      if (options.regelsbeleid.filter(x => x.group === 'regelStatus').length) {
        // Geldend en/of In voorbereiding
        const regelStatus = options.regelsbeleid
          .filter(x => x.group === 'regelStatus')
          .map(regelstatustype => mapRegelStatusToIhrRegelStatus(regelstatustype.id as RegelStatus))
          .join();
        if (regelStatus) {
          parameters = parameters.set('regelStatus', regelStatus);
          if (
            regelStatus.includes(IhrRegelStatus.Vastgesteld) &&
            options[FilterName.DATUM].length &&
            options[FilterName.DATUM][0].timeTravelDate
          ) {
            parameters = parameters.set(
              'beschikbaarOp',
              formattedDateTime(new Date(`${options[FilterName.DATUM][0].timeTravelDate}T12:00Z`), true)
            );
          }
        }
      } else {
        // Indien geen van beide regelStatus Filteritems is ingesteld moeten regelStatus geldend en in
        // ontwikkeling worden meegestuurd; hiermee wordt voorkomen dat er plannen in de volgende statussen worden
        // opgehaald:
        // voorontwerp, concept, vervallen, niet in werking, historisch, verwijderd, en plannen met een status die
        // niet in overeenstemming zijn met de dossierstatus.
        // (zie: https://ruimte.omgevingswet.overheid.nl/ruimtelijke-plannen/api/opvragen/v4)
        parameters = parameters.set('regelStatus', [IhrRegelStatus.Vastgesteld, IhrRegelStatus.Ontwerp].join());
      }

      // Regels en/of Beleid, maar regelgevingtype heeft voorrang
      if (
        options.regelsbeleid.filter(x => x.group === 'regelsbeleidType').length > 0 &&
        options[FilterName.REGELGEVING_TYPE].length === 0
      ) {
        const regelTypeBeleid = options.regelsbeleid.filter(x => x.group === 'regelsbeleidType' && x.id === 'beleid');
        const regelTypeRegels = options.regelsbeleid.filter(x => x.group === 'regelsbeleidType' && x.id === 'regels');
        const regelBinding = [];
        if (regelTypeBeleid.length) {
          regelBinding.push('beleid');
        }
        if (regelTypeRegels.length) {
          regelBinding.push('burgerbindend');
          regelBinding.push('instructieregels');
        }
        if (regelBinding.length) {
          parameters = parameters.set('regelBinding', regelBinding.join());
        }
      }
    }
    if (params.bestuurslaag) {
      switch (params.bestuurslaag) {
        case Bestuurslaag.GEMEENTE:
          parameters = parameters.set(
            'beleidsmatigVerantwoordelijkeOverheid.type',
            'deelgemeente/stadsdeel,gemeentelijke overheid'
          );
          break;
        case Bestuurslaag.PROVINCIE:
          parameters = parameters.set('beleidsmatigVerantwoordelijkeOverheid.type', 'provinciale overheid');
          break;
        default:
          parameters = parameters.set('beleidsmatigVerantwoordelijkeOverheid.type', 'nationale overheid');
      }
    }
    if (params.ponsOmgevingsplan) {
      parameters = parameters.set('ponsOmgevingsplan', 'true');
    }

    return parameters;
  }

  private static hasBlockingParams(params: HttpParams): boolean {
    // Blokkeer request wanneer regelBinding als enige waarde 'Omgevingswaarderegel' heeft
    return params.get('regelBinding') === 'Omgevingswaarderegel';
  }

  public loadDocsByGeometry$(
    filterOptions: FilterOptions,
    ponsOmgevingsplan?: boolean,
    bestuurslaag?: Bestuurslaag
  ): Observable<Plan[]> {
    let queryParams: HttpParams = IhrPlannenService.getQueryParams({
      filterOptions,
      ponsOmgevingsplan,
      bestuurslaag,
    });

    // Wanneer louter gefilterd wordt op filters die niet van toepassing zijn, of
    // wanneer regelBinding als enige waarde 'Omgevingswaarderegel' heeft
    // voor IHR een lege response geven
    const regelBindingQueryParam = queryParams?.get('regelBinding');
    if (!queryParams || regelBindingQueryParam === 'Omgevingswaarderegel') {
      return of([]);
    }

    // Verwijder bij parameter regelBinding bij meerdere waardes de waarde 'Omgevingswaarderegel'
    // Deze waarde heeft geen betrekking op IHR plannen en veroorzaakt een foutmelding
    const regelBindingValues = regelBindingQueryParam?.split(',').filter(value => value !== 'Omgevingswaarderegel');
    queryParams = regelBindingValues?.length ? queryParams.set('regelBinding', regelBindingValues.join()) : queryParams;
    // voeg bbox toe
    queryParams = queryParams.set('expand', 'bbox');
    const location = filterOptions[FilterName.LOCATIE][0];
    const fetchUrl: string = this.provider.createIhrplannenUrl(`?${queryParams.toString()}`);
    return this.provider
      .fetchIhrplannenByUrl$(fetchUrl, location)
      .pipe(
        tap(result => {
          this.store.dispatch(
            PlannenActions.ihrSetNextUrl({
              bestuurslaag,
              href: result._links?.next?.href,
            })
          );
        })
      )
      .pipe(map(result => result._embedded.plannen));
  }

  public loadMorePlannen$(href: string, location: LocatieFilter, bestuurslaag: Bestuurslaag): Observable<Plan[]> {
    return this.provider
      .fetchIhrplannenByUrl$(href, location)
      .pipe(
        tap(result =>
          this.store.dispatch(
            PlannenActions.ihrSetNextUrl({
              bestuurslaag,
              href: result._links?.next?.href,
            })
          )
        )
      )
      .pipe(map(result => result._embedded.plannen));
  }
}
