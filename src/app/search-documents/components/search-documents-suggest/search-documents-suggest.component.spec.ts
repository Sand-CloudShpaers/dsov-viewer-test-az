import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { MockComponent } from 'ng-mocks';
import { SearchDocumentsFacade } from '~search-documents/search-documents.facade';
import { NavigationFacade } from '~store/common/navigation/+state/navigation.facade';
import { SearchDocumentsSuggestComponent } from './search-documents-suggest.component';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { ApplicationPage, ViewerPage } from '~store/common/navigation/types/application-page';
import { Router } from '@angular/router';
import { DocumentSuggestion } from '~search-documents/types/document-suggestion';
import { derivedLoadingState } from '~general/utils/store.utils';
import { LoadingState } from '~model/loading-state.enum';

describe('SearchDocumentsSuggestComponent', () => {
  const spyOn_searchSuggestions = jasmine.createSpy('spyOn_searchSuggestions');
  const spyOn_setNavigationPath = jasmine.createSpy('spyOn_setNavigationPath');
  const spyOn_navigate = jasmine.createSpy('spyOn_navigate');

  let spectator: Spectator<SearchDocumentsSuggestComponent>;
  const createComponent = createComponentFactory({
    component: SearchDocumentsSuggestComponent,
    imports: [RouterTestingModule],
    providers: [
      {
        provide: SearchDocumentsFacade,
        useValue: {
          suggestions$: () => of([]),
          searchSuggestions: spyOn_searchSuggestions,
        },
      },
      mockProvider(NavigationFacade, {
        setNavigationPath: spyOn_setNavigationPath,
      }),
      {
        provide: Router,
        useValue: {
          navigate: spyOn_navigate,
        },
      },
    ],
    declarations: [MockComponent(SearchDocumentsSuggestComponent)],
  });

  beforeEach(() => {
    spectator = createComponent();
    spectator.detectComponentChanges();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  describe('search', () => {
    it('should call searchSuggestions', () => {
      spectator.component.search({
        detail: 'test',
      } as CustomEvent);

      expect(spyOn_searchSuggestions).toHaveBeenCalledWith('test');
    });
  });

  describe('select', () => {
    it('should show and open suggestion without time travel parameters', () => {
      const suggestion = {
        detail: {
          name: 'test',
          id: 'id',
        },
      } as CustomEvent;

      spectator.component.suggestionStatus$ = of(derivedLoadingState(LoadingState.RESOLVED));
      spectator.detectComponentChanges();

      spectator.component.select(suggestion);

      expect(spyOn_setNavigationPath).toHaveBeenCalledWith(ViewerPage.DOCUMENT, location.pathname);
      expect(spyOn_navigate).toHaveBeenCalledWith(
        [`${ApplicationPage.VIEWER}/${ViewerPage.DOCUMENT}`, 'id'],
        undefined
      );
    });

    it('should show and open suggestion WITH time travel parameters', () => {
      const suggestion = {
        detail: {
          name: 'test',
          id: 'id',
          timeTravelDates: {
            beschikbaarOp: '2022-01-01',
            inWerkingOp: '2030-01-01',
            geldigOp: '2025-01-01',
          },
        },
      } as CustomEvent;

      spectator.component.suggestionStatus$ = of(derivedLoadingState(LoadingState.RESOLVED));
      spectator.detectComponentChanges();

      spectator.component.select(suggestion);

      expect(spyOn_navigate).toHaveBeenCalledWith([`${ApplicationPage.VIEWER}/${ViewerPage.DOCUMENT}`, 'id'], {
        queryParams: {
          beschikbaarOp: '2022-01-01',
          inWerkingOp: '2030-01-01',
          geldigOp: '2025-01-01',
        },
      });
    });
  });

  describe('getNumberOfResults', () => {
    const suggestion: DocumentSuggestion = {
      id: 'id',
      value: 'value',
      type: 'type',
      date: new Date(),
    };
    it('should return "1 resultaat gevonden"', () => {
      expect(spectator.component.getNumberOfResults([suggestion])).toEqual('1 resultaat gevonden');
    });

    it('should return "2 resultaten gevonden"', () => {
      expect(spectator.component.getNumberOfResults([suggestion, suggestion])).toEqual('2 resultaten gevonden');
    });

    it('should return null', () => {
      expect(spectator.component.getNumberOfResults([])).toEqual(null);
    });
  });

  describe('getNotFoundLabel', () => {
    it(
      'should return a label including current and minimal required length of searchstring when the length of the' +
        ' entered searchstring is less that the minimal required length',
      () =>
        /* eslint-disable jasmine/new-line-before-expect */
        ['', '1', '22'].forEach(searchString =>
          expect(spectator.component.getNotFoundLabel(searchString)).toEqual(
            `Geen documenten gevonden. Probeer een (andere) zoekterm met meer dan ${searchString.length} karakter(s).`
          )
        )
      /* eslint-enable */
    );

    it(
      'should return a basic message when the length of the searchstring is equal or greater than the minimal' +
        ' required length',
      () =>
        /* eslint-disable jasmine/new-line-before-expect */
        ['333', '4444'].forEach(searchString =>
          expect(spectator.component.getNotFoundLabel(searchString)).toEqual(
            'Geen documenten gevonden. Probeer een (andere) zoekterm.'
          )
        )
      /* eslint-enable */
    );
  });
});
