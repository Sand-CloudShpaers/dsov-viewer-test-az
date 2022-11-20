import { Injectable } from '@angular/core';
import { Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize, take, tap } from 'rxjs/operators';
import { SuggestDoc } from '~model/georegister/suggest.model';
import { PdokService } from '~viewer/search/services/pdok-service';
import { NavigationService } from '~store/common/navigation/services/navigation.service';
import { LocationQueryParams, TimeTravelQueryParams } from '~store/common/navigation/types/query-params';
import { MAX_DECIMALS_ETRS89 } from '~general/utils/geo.utils';
import { setMaxDecimalsUsingFloor } from '~general/utils/math.utils';

export interface SearchingStatus {
  error?: string;
  loading?: boolean;
}

@Injectable()
export class LocatieFilterService {
  private status$: BehaviorSubject<SearchingStatus> = new BehaviorSubject<SearchingStatus>({ loading: false });
  public readonly searchStatus$: Observable<SearchingStatus> = this.status$.asObservable();
  private suggestions$: BehaviorSubject<Array<SuggestDoc>> = new BehaviorSubject<Array<SuggestDoc>>([]);
  public readonly searchSuggestions$: Observable<Array<SuggestDoc>> = this.suggestions$.asObservable();

  constructor(
    protected store: Store,
    private router: Router,
    private pdokService: PdokService,
    private navigationService: NavigationService
  ) {}

  public suggestLocation(input?: string): void {
    // eslint-disable-next-line rxjs/no-subject-value
    this.status$.next({ ...this.status$.value, error: '' });
    this.suggestions$.next([]);
    if (!input?.trim() || !this.isValidInput(input)) {
      return;
    }
    // eslint-disable-next-line rxjs/no-subject-value
    this.status$.next({ ...this.status$.value, loading: true });
    this.pdokService
      .suggestLocations$(`fq=type:(adres OR perceel)&q=${input}`)
      .pipe(
        tap(suggestions => this.suggestions$.next(suggestions)),
        tap(suggestions => this.checkResult(input, suggestions)),
        catchError(() =>
          this.handleError(
            'Zoeken op locatie is niet mogelijk op dit moment. Probeer het later nog eens of zoek via Meer zoekopties.'
          )
        ),
        finalize(this.endCall.bind(this)),
        take(1)
      )
      .subscribe();
  }

  public openSuggestion = (commands: string[], location: string, timeTravelDate?: string): void => {
    const queryParams: Params = {
      ...this.navigationService.getEmptyQueryParams(LocationQueryParams),
      ...this.navigationService.getEmptyQueryParams(TimeTravelQueryParams),
      [LocationQueryParams.LOCATIE]: location,
    };

    if (timeTravelDate) {
      queryParams[TimeTravelQueryParams.DATE] = timeTravelDate;
    }
    this.router.navigate(commands, {
      queryParams,
      queryParamsHandling: 'merge',
    });
  };

  public isValidInput(value?: string): boolean {
    const format = /[!`@#$%^&*+=[\]{};:"\\|<>?]+/;
    return !format.test(value);
  }

  public getParsedCoordinates(input: string, isRd: boolean): number[] {
    if (input) {
      if (isRd) {
        const result = input.split(',').map(c => parseInt(c, 10));
        if (
          result.length === 2 &&
          result[0].toString().length >= 5 &&
          result[0].toString().length <= 6 &&
          result[1].toString().length === 6
        ) {
          return result;
        }
        return null;
      } else {
        // ETRS89
        let parsedInput = input;
        if (parsedInput.indexOf(';') > 0) {
          parsedInput = parsedInput.replace(/,/g, '.').replace(/;/g, ',');
        }
        const result = parsedInput
          .split(',')
          .flatMap(c => parseFloat(c))
          .filter(c => !isNaN(c))
          .map(c => setMaxDecimalsUsingFloor(c, MAX_DECIMALS_ETRS89));
        return result.length === 2 ? result : null;
      }
    }
    return null;
  }

  private handleError = (error: string): Observable<boolean> => {
    // eslint-disable-next-line rxjs/no-subject-value
    this.status$.next({ ...this.status$.value, error });
    return of(false);
  };

  private checkResult = (input: string, result: SuggestDoc[]): void => {
    if (result?.length === 0) {
      this.handleError(input + ' niet gevonden in Nederland.');
    }
  };

  // eslint-disable-next-line rxjs/no-subject-value
  private endCall = (): void => this.status$.next({ ...this.status$.value, loading: false });
}
