import { DOCUMENT } from '@angular/common';
import { Directive, HostListener, Inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { scrollToElement } from '~general/utils/dso-animations';
import { State } from '~store/state';
import * as DocumentElementLinkActions from '~viewer/documenten/+state/document-element-link/document-element-link.actions';
import * as DocumentTekstenPlanobjectActions from '~viewer/documenten/+state/document-teksten-planobject/document-teksten-planobject.actions';

const isAbsolute = /^https?:\/\//i;

@Directive({
  selector: '[dsovLinkHandler]',
})
export class LinkHandlerDirective {
  @Input('dsovLinkHandler') inputParams: { documentId: string; tekstId?: string };

  constructor(private router: Router, @Inject(DOCUMENT) private document: Document, private store: Store<State>) {}

  @HostListener('click', ['$event'])
  public onClick(event: MouseEvent): void {
    if (event.target instanceof HTMLAnchorElement) {
      // we moeten 3 senarios afhandelen: 1 externe link, 2 interne link, 3 anchor link
      const documentBaseURI = document.baseURI;
      const href: string = event.target.getAttribute('href');
      const strippedHref = href.replace(documentBaseURI, '');
      if (strippedHref.startsWith('#')) {
        // href is een anchor dus we hoeven alleen te scrollen
        const fragment = strippedHref.substring(1);
        scrollToElement(fragment, document);

        event.preventDefault();
      } else if (!isAbsolute.test(strippedHref)) {
        // href is een interne url kunnen we opvangen met router
        this.router.navigateByUrl(strippedHref);
        event.preventDefault();
      } else {
        // href is een externe url kan de browser afhandelen
        return;
      }
    } else if (event.target instanceof HTMLSpanElement) {
      const documentId = this.inputParams.documentId;

      // Attributen worden gevuld door IHR daarom halen we hier de informatie op met een getAttribute
      const documentReference: string = event.target.getAttribute('data-verwijst-naar-documentcomponent');
      const imroTekstId: string = event.target.getAttribute('data-imro-tekst-id');
      const elementId = imroTekstId ? imroTekstId : documentReference;
      const planobjectId: string = event.target.getAttribute('data-plan-object-id');

      if (documentId && this.inputParams.tekstId) {
        this.store.dispatch(
          DocumentElementLinkActions.storeDocumentElementLink({ documentId, elementId: this.inputParams.tekstId })
        );
        event.preventDefault();
      } else if (documentId && elementId) {
        this.store.dispatch(DocumentElementLinkActions.storeDocumentElementLink({ documentId, elementId }));
      } else if (planobjectId) {
        const ihrObjectInfoType: string = event.target.getAttribute('data-ihr-object-info-type');
        const ihrObjectInfoLabel: string = event.target.getAttribute('data-ihr-object-info-label');
        this.store.dispatch(
          DocumentTekstenPlanobjectActions.storeDocumentPlanobjectId({
            documentId,
            planobjectId,
            ihrObjectInfoType,
            ihrObjectInfoLabel,
          })
        );
      }
    } else {
      // event.target is geen <a> of <span > dus we hoeven niets te doen
      return;
    }
  }
}
