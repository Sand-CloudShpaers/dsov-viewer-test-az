import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { State } from '~store/state';
import { closeOverlay } from '~viewer/overlay/+state/overlay.actions';
import { selectOverlayPanelVM, selectShowOverlay } from './overlay.selectors';
import * as DocumentElementLinkActions from '~viewer/documenten/+state/document-element-link/document-element-link.actions';
import { ImopNodeType } from '~viewer/documenten/types/imop-nodetypes';

@Injectable({ providedIn: 'root' })
export class OverlayFacade {
  constructor(private store: Store<State>) {}

  public readonly overlayPanelVM$ = this.store.pipe(select(selectOverlayPanelVM));

  public readonly showOverlay$ = this.store.pipe(select(selectShowOverlay));

  public openLink(documentId: string, elementId: string, nodeType: ImopNodeType): void {
    this.store.dispatch(DocumentElementLinkActions.storeDocumentElementLink({ documentId, elementId, nodeType }));
  }

  public dispatchCloseOverlay(): void {
    this.store.dispatch(closeOverlay());
  }
}
