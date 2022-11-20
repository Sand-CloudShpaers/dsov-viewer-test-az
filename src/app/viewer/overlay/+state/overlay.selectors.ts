import { createFeatureSelector, createSelector } from '@ngrx/store';
import { overlayPanelKey } from '~store/state';
import * as fromOverlay from '~viewer/overlay/+state/overlay.reducer';
import { derivedLoadingState } from '~general/utils/store.utils';
import { OverlayVM } from '../types/overlayVM';

const layoutFeatureSelector = createFeatureSelector<fromOverlay.State>(overlayPanelKey);

export const selectOverlayPanelVM = createSelector(layoutFeatureSelector, (state): OverlayVM => {
  let content = state.content;
  if (content) {
    if (!content.split(content.match(/^<h3>.*<\/h3>/)[0])[1].length) {
      // Geen titel, dus geen inhoud
      content += '<div> Geen inhoud beschikbaar </div>';
    }
  }

  return {
    content,
    element: state.element,
    hasOverlayShadow: state.showApplicationInfo || state.showDocumentTeksten || state.showInterneLinkContainer,
    isHeaderWhite: state.showHelp,
    isSmall: state.showHelp,
    showHelp: state.showHelp,
    showInterneLinkContainer: state.showInterneLinkContainer,
    showDocumentTeksten: state.showDocumentTeksten,
    showApplicationInfo: state.showApplicationInfo,
    title: getTitle(state),
    subtitle: getSubtitle(state),
    loadingStatus: derivedLoadingState(state.loadingStatus),
    documentId: state.documentId,
  };
});

export const selectShowOverlay = createSelector(
  layoutFeatureSelector,
  (state): boolean =>
    state.showInterneLinkContainer || state.showApplicationInfo || state.showDocumentTeksten || state.showHelp
);

const getTitle = (state: fromOverlay.State): string => {
  if (state.showHelp) {
    return 'Help';
  } else if (state.showApplicationInfo) {
    return 'Versie informatie';
  }
  return state.title;
};

const getSubtitle = (state: fromOverlay.State): string => {
  if (state.showHelp) {
    return '';
  }
  return state.subtitle;
};
