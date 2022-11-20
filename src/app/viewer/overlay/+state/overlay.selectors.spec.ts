import { LoadingState } from '~model/loading-state.enum';
import { derivedLoadingState } from '~general/utils/store.utils';
import * as fromOverlay from './overlay.selectors';

describe('overlaySelectors', () => {
  describe('selectOverlayPanelVM', () => {
    it('should select OverlayPanelVM with internal link', () => {
      expect(
        fromOverlay.selectOverlayPanelVM.projector({
          content: '',
          showApplicationInfo: false,
          showInterneLinkContainer: true,
          showDocumentTeksten: false,
          showHelp: false,
          loadingStatus: LoadingState.RESOLVED,
          title: 'title',
          subtitle: 'subtitle',
          documentId: 'documentId',
        })
      ).toEqual({
        content: '',
        element: undefined,
        showApplicationInfo: false,
        showInterneLinkContainer: true,
        showDocumentTeksten: false,
        showHelp: false,
        loadingStatus: derivedLoadingState(LoadingState.RESOLVED),
        title: 'title',
        subtitle: 'subtitle',
        documentId: 'documentId',
        hasOverlayShadow: true,
        isHeaderWhite: false,
        isSmall: false,
      });
    });

    it('should select OverlayPanelVM with application info', () => {
      expect(
        fromOverlay.selectOverlayPanelVM.projector({
          content: '',
          showApplicationInfo: true,
          showInterneLinkContainer: false,
          showDocumentTeksten: false,
          showHelp: false,
          loadingStatus: LoadingState.RESOLVED,
        })
      ).toEqual({
        content: '',
        element: undefined,
        showApplicationInfo: true,
        showInterneLinkContainer: false,
        showDocumentTeksten: false,
        showHelp: false,
        loadingStatus: derivedLoadingState(LoadingState.RESOLVED),
        title: 'Versie informatie',
        subtitle: undefined,
        documentId: undefined,
        hasOverlayShadow: true,
        isHeaderWhite: false,
        isSmall: false,
      });
    });

    it('should select OverlayPanelVM with help', () => {
      expect(
        fromOverlay.selectOverlayPanelVM.projector({
          content: '',
          showApplicationInfo: false,
          showInterneLinkContainer: false,
          showDocumentTeksten: false,
          showHelp: true,
          loadingStatus: LoadingState.RESOLVED,
        })
      ).toEqual({
        content: '',
        element: undefined,
        showApplicationInfo: false,
        showInterneLinkContainer: false,
        showDocumentTeksten: false,
        showHelp: true,
        loadingStatus: derivedLoadingState(LoadingState.RESOLVED),
        title: 'Help',
        subtitle: '',
        documentId: undefined,
        hasOverlayShadow: false,
        isHeaderWhite: true,
        isSmall: true,
      });
    });

    it('should select OverlayPanelVM with show: false', () => {
      expect(
        fromOverlay.selectOverlayPanelVM.projector({
          content: '',
          showApplicationInfo: false,
          showInterneLinkContainer: false,
          showDocumentTeksten: false,
          showHelp: false,
          loadingStatus: LoadingState.RESOLVED,
        })
      ).toEqual({
        content: '',
        element: undefined,
        showApplicationInfo: false,
        showInterneLinkContainer: false,
        showDocumentTeksten: false,
        showHelp: false,
        loadingStatus: derivedLoadingState(LoadingState.RESOLVED),
        title: undefined,
        subtitle: undefined,
        documentId: undefined,
        hasOverlayShadow: false,
        isHeaderWhite: false,
        isSmall: false,
      });
    });
  });

  describe('selectShowOverlay', () => {
    it('should selectShowOverlay as true when showInternelinkContainer is true', () => {
      expect(fromOverlay.selectShowOverlay.projector({ showInterneLinkContainer: true })).toEqual(true);
    });

    it('should selectShowOverlay as true when showApplicationInfo is true', () => {
      expect(fromOverlay.selectShowOverlay.projector({ showApplicationInfo: true })).toEqual(true);
    });

    it('should selectShowOverlay as true when showDocumentTeksten is true', () => {
      expect(fromOverlay.selectShowOverlay.projector({ showDocumentTeksten: true })).toEqual(true);
    });

    it('should selectShowOverlay as true when showHelp is true', () => {
      expect(fromOverlay.selectShowOverlay.projector({ showHelp: true })).toEqual(true);
    });

    it(
      'should selectShowOverlay as true when showDocumentTeksten, showApplicationInfo, showInterneLinkContainer and' +
        ' showHelp  are all false',
      () => {
        expect(
          fromOverlay.selectShowOverlay.projector({
            showApplicationInfo: false,
            showDocumentTeksten: false,
            showInterneLinkContainer: false,
            showHelp: false,
          })
        ).toEqual(false);
      }
    );
  });
});
