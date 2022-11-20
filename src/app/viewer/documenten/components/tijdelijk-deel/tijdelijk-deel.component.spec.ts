import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockComponent } from 'ng-mocks';
import { TijdelijkDeelComponent } from './tijdelijk-deel.component';
import initialState from '~mocks/initial-state';
import { DocumentenFacade } from '~viewer/documenten/+state/documenten.facade';
import { BehaviorSubject, of } from 'rxjs';
import { LoadingState } from '~model/loading-state.enum';
import { DerivedLoadingState, derivedLoadingState } from '~general/utils/store.utils';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ApiSource } from '~model/internal/api-source';
import { Bestuurslaag } from '~viewer/documenten/types/documenten.model';

describe('TijdelijkDeelComponent', () => {
  let spectator: Spectator<TijdelijkDeelComponent>;
  const spyOnLoadDocument = jasmine.createSpy('spyOnLoadDocument');
  const loadingState$ = new BehaviorSubject<DerivedLoadingState>(derivedLoadingState(LoadingState.IDLE));

  const createComponent = createComponentFactory({
    component: TijdelijkDeelComponent,
    providers: [
      provideMockStore({ initialState }),
      mockProvider(DocumentenFacade, {
        loadDocument: spyOnLoadDocument,
        documentVM$: () => of(),
        documentStatus$: () => loadingState$.asObservable(),
      }),
    ],
    declarations: [MockComponent(TijdelijkDeelComponent)],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent({ detectChanges: false });
    spectator.inject(MockStore);
    spectator.setInput({
      tijdelijkDeel: {
        documentId: '/tijdelijk/deel/id',
        isOntwerp: false,
        type: 'voorbereidingsbesluit',
        title: 'Titel',
        statusDateLine: '',
        inwerkingVanaf: new Date('12-1-2021'),
        apiSource: ApiSource.OZON,
        subPages: null,
        bevoegdGezag: { naam: 'naam', code: 'code', bestuurslaag: Bestuurslaag.GEMEENTE },
      },
    });
    spectator.detectChanges();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('Load document', () => {
    expect(spyOnLoadDocument).toHaveBeenCalled();
    expect(spectator.query('[data-test-id="part-content-/tijdelijk/deel/id"]')).not.toExist();

    loadingState$.next(derivedLoadingState(LoadingState.RESOLVED));
    spectator.detectChanges();

    expect(spectator.query('[data-test-id="part-content-/tijdelijk/deel/id"]')).toExist();
  });
});
