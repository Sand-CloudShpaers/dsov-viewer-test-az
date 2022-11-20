import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { createRoutingFactory, SpectatorRouting, SpyObject } from '@ngneat/spectator';
import { LinkHandlerDirective } from '~general/directives/link-handler/link-handler.directive';
import { PipesModule } from '~general/pipes/pipes.module';
import { provideMockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import { State } from '~viewer/documenten/+state';
import { TestBed } from '@angular/core/testing';
import * as DocumentElementLinkActions from '~viewer/documenten/+state/document-element-link/document-element-link.actions';
import * as DocumentTekstenPlanobjectActions from '~viewer/documenten/+state/document-teksten-planobject/document-teksten-planobject.actions';

@Component({
  template: `
    <div id="externelink" [innerHtml]="contentexternelink | safeHtmlUtil" dsovLinkHandler></div>
    <div id="ankerdiv" [innerHtml]="contentankerlink | safeHtmlUtil" dsovLinkHandler></div>
    <div id="internelink" [innerHtml]="contentinternelink | safeHtmlUtil" dsovLinkHandler></div>
    <div
      id="interneIhrlink"
      [innerHtml]="contentInterneIhrlink | safeHtmlUtil"
      [dsovLinkHandler]="{ documentId: 'plan-id', tekstId: 'tekst-id' }"
    ></div>
    <div id="geenlinkdiv" [innerHtml]="contentgeenlink | safeHtmlUtil" dsovLinkHandler></div>
    <div
      id="planobjectIdLink"
      [innerHTML]="contentPlanobjectIdLink | safeHtmlUtil"
      [dsovLinkHandler]="{ documentId: 'NL.IMRO.a.b.c' }"
    ></div>
  `,
})
class MockDocumentComponent {
  public contentexternelink = `<a href="https://www.ruimtelijkeplannen.nl/viewer/viewer?planidn=NL.IMRO.0183.1317010-oh01" target="_blank"
         rel="noopener noreferrer">
         Dit is een externe link
      </a>`;

  public contentankerlink = `<div>
      <a href="#anker1">[Dit is een anchor link]</a>
    </div>
    <div>
      <ul>
        <li id="anker1">
          Hier verwijst de anchor link naartoe
        </li>
      </ul>
    </div>`;

  public contentinternelink = '<a href="./internallink">Interne link</a>';

  public contentInterneIhrlink = `<span
  data-imro-tekst-id="tekst-id"
  data-imro-plan-id="plan-id"
  data-verwijst-naar-documentcomponent="verwijst-naar"
  >
        Interne link
    </span>`;

  public contentgeenlink = `<div id="geenlink">
        Helaas geen link
    </div>`;

  public contentPlanobjectIdLink = `<span
  data-plan-object-id="NL.IMRO.zyx"
  data-ihr-object-info-type="Enkelbestemming"
  data-ihr-object-info-label="waarde"
  >
        PlanobjectIdLink
    </span>`;
}

describe('Directive: LinkHandlerDirective', () => {
  let spectator: SpectatorRouting<MockDocumentComponent>;
  let scrollIntoViewMock: jasmine.Spy<jasmine.Func>;
  let router: SpyObject<Router>;
  let store$: Store<State>;

  const createRouterComponent = createRoutingFactory({
    component: MockDocumentComponent,
    declarations: [LinkHandlerDirective],
    providers: [provideMockStore({})],
    imports: [PipesModule],
  });

  beforeEach(() => {
    spectator = createRouterComponent();
    scrollIntoViewMock = jasmine.createSpy('scrollIntoView');
    // window.onbeforeunload = jasmine.createSpy('onbeforeunload');
    (window as any).HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;
    router = spectator.inject(Router);
    store$ = TestBed.inject(Store);
    spyOn(store$, 'dispatch').and.stub();
  });

  it('click on an external HTML link (HTMLAnchorElement) should open a new browser tab with the external link', () => {
    const externeLinkDiv = spectator.query('#externelink');
    const externeLink = externeLinkDiv.querySelector('a');
    spectator.click(externeLink);
    spectator.dispatchMouseEvent(externeLink, 'click');

    expect(router.navigate).not.toHaveBeenCalled();
    expect(router.navigateByUrl).not.toHaveBeenCalled();
    expect(scrollIntoViewMock).toHaveBeenCalledTimes(0);
  });

  it('click on HTML link (HTMLAnchorElement) of type anchor should result in scroll to anchor element', () => {
    const ankerDiv = spectator.query('#ankerdiv');
    const ankerLink = ankerDiv.querySelector('a');
    spectator.click(ankerLink);

    expect(router.navigateByUrl).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
    expect(scrollIntoViewMock).toHaveBeenCalledTimes(1);
  });

  it('click on an internal HTML link (HTMLAnchorElement) not of type anchor should result in rerouting of the angular app', async () => {
    const interneLinkDiv = spectator.query('#internelink');
    const interneLink = interneLinkDiv.querySelector('a');
    spectator.click(interneLink);

    expect(router.navigate).not.toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('./internallink');
    expect(scrollIntoViewMock).toHaveBeenCalledTimes(0);
  });

  it('click on an internal HTML IHR link (HTMLSpanElement) should dispatch internal link', async () => {
    const interneLinkDiv = spectator.query('#interneIhrlink');
    const interneLink = interneLinkDiv.querySelector('span');
    spectator.click(interneLink);

    expect(store$.dispatch).toHaveBeenCalledWith(
      DocumentElementLinkActions.storeDocumentElementLink({ documentId: 'plan-id', elementId: 'tekst-id' })
    );

    expect(scrollIntoViewMock).toHaveBeenCalledTimes(0);
  });

  it('click on a plan objectId link should storeDocumentPlanObjectId', () => {
    const planobjectIdDiv = spectator.query('#planobjectIdLink');
    const planobjectIdLink = planobjectIdDiv.querySelector('span');
    spectator.click(planobjectIdLink);

    expect(store$.dispatch).toHaveBeenCalledWith(
      DocumentTekstenPlanobjectActions.storeDocumentPlanobjectId({
        documentId: 'NL.IMRO.a.b.c',
        planobjectId: 'NL.IMRO.zyx',
        ihrObjectInfoType: 'Enkelbestemming',
        ihrObjectInfoLabel: 'waarde',
      })
    );
  });

  it('click on another html element not being a link (a tag) should not result in scrolling or rerouting', () => {
    const geenLinkDiv = spectator.query('#geenlinkdiv');
    const geenLink = geenLinkDiv.querySelector('div');
    spectator.click(geenLink);

    expect(router.navigate).not.toHaveBeenCalled();
    expect(router.navigateByUrl).not.toHaveBeenCalled();
    expect(scrollIntoViewMock).toHaveBeenCalledTimes(0);
  });
});
