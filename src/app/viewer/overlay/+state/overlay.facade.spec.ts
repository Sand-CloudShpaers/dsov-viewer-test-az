import { OverlayFacade } from '~viewer/overlay/+state/overlay.facade';
import { Store } from '@ngrx/store';
import { overlayPanelKey, State } from '~store/state';
import { LoadingState } from '~model/loading-state.enum';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { closeOverlay } from '~viewer/overlay/+state/overlay.actions';

describe('OverlayFacade', () => {
  let overlayFacade: OverlayFacade;
  let store$: Store<State>;

  const initialState = {
    [overlayPanelKey]: {
      content: 'content',
      showApplicationInfo: false,
      showInterneLinkContainer: false,
      showDocumentTeksten: false,
      loadingStatus: LoadingState.RESOLVED,
      documentId: 'abc',
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OverlayFacade, provideMockStore({ initialState })],
    });
    overlayFacade = TestBed.inject(OverlayFacade);
    store$ = TestBed.inject(Store);

    spyOn(store$, 'dispatch').and.stub();
  });

  describe('dispatchCloseOverlay', () => {
    it('should dispatch closeOverlay', () => {
      overlayFacade.dispatchCloseOverlay();

      expect(store$.dispatch).toHaveBeenCalledWith(closeOverlay());
    });
  });
});
