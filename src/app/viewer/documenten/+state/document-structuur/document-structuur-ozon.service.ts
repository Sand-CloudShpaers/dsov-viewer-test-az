import { Injectable } from '@angular/core';
import {
  Breadcrumb,
  DocumentBodyElement,
  DocumentBodyElementTitle,
  DocumentBodyElementType,
} from '~viewer/documenten/types/documenten.model';
import { DocumentViewContext, LayoutStateVM } from '~viewer/documenten/types/layout.model';
import { ApiSource } from '~model/internal/api-source';
import { DocumentComponent } from '~ozon-model/documentComponent';
import { Regeltekst } from '~ozon-model/regeltekst';
import { getIsInitialOpen, getLayout } from './ozon-helpers/element-layout';
import { getElementType } from './ozon-helpers/element-type';
import { getPrefix, getSuffix, getTitle } from './ozon-helpers/element-title';
import { DocumentSubPagePath } from '~viewer/documenten/types/document-pages';
import striptags from 'striptags';
import { RegeltekstEntity } from '../regeltekst/regeltekst.reducer';
import { DivisieannotatieEntity } from '~viewer/documenten/+state/divisieannotatie/divisieannotatie.reducer';
import { OntwerpDocumentComponent } from '~ozon-model/ontwerpDocumentComponent';
import { getEmbeddedComponents } from './ozon-helpers/embedded-components';
import { OntwerpRegeltekst } from '~ozon-model/ontwerpRegeltekst';
import { Divisieannotatie } from '~ozon-model/divisieannotatie';
import { OntwerpDivisieannotatie } from '~ozon-model/ontwerpDivisieannotatie';

export const START_NIVEAU = 2;

export interface FilterElement {
  identificatie: string;
  kruimelpad: string[];
}

@Injectable()
export class DocumentStructuurOzonService {
  public mapDocumentStructuurElement(
    element: DocumentComponent | OntwerpDocumentComponent,
    documentId: string,
    niveau: number,
    layoutVM: LayoutStateVM = {},
    isFiltered: boolean,
    filteredElements: FilterElement[],
    documentViewContext: DocumentViewContext,
    subPagePath: DocumentSubPagePath,
    breadcrumbs: Breadcrumb[],
    expandedView: boolean
  ): DocumentBodyElement {
    const id = element.identificatie;
    const type = getElementType(element);

    let annotationLink: string;
    if ((element as OntwerpDocumentComponent).ontwerpbesluitIdentificatie) {
      // Dit is een ontwerp element
      const component = element as OntwerpDocumentComponent;
      annotationLink =
        component._links.regeltekst?.href ||
        component._links.divisieannotatie?.href ||
        component._links.ontwerpregeltekst?.href ||
        component._links.ontwerpdivisieannotatie?.href ||
        component._links.beeindigdeontwerpdivisieannotatie?.href ||
        component._links.beeindigdeontwerpregeltekst?.href;
    } else {
      const component = element as DocumentComponent;
      annotationLink = component._links?.regeltekst?.href || component._links?.divisieannotatie?.href;
    }

    const title: DocumentBodyElementTitle = {
      content: getTitle(element),
      prefix: getPrefix(element),
      suffix: getSuffix(element),
    };
    const initialIsOpen = getIsInitialOpen(
      element,
      documentViewContext,
      filteredElements,
      isFiltered,
      layoutVM,
      niveau,
      expandedView
    );

    breadcrumbs.push({
      id,
      titel: `${title.prefix} ${element.nummer || ''} ${striptags(title.content)} ${title.suffix}`.trimEnd(),
    });

    const stuctuurElementen = this.mapDocumentStructuurElementen(
      element,
      documentId,
      niveau + 1,
      filteredElements,
      documentViewContext,
      subPagePath,
      layoutVM,
      breadcrumbs,
      expandedView
    );

    const isOntwerp = !!(element as OntwerpDocumentComponent).bevatOntwerpInformatie;
    const layout = getLayout(
      element,
      stuctuurElementen.hasChildren,
      !!annotationLink,
      isFiltered,
      documentViewContext,
      expandedView
    );

    const elementLayoutVM = layoutVM[id];
    layout.isOpen = elementLayoutVM?.collapse ? elementLayoutVM.collapse.isOpen : initialIsOpen;
    layout.showAnnotation = !!elementLayoutVM?.annotaties?.isOpen;

    return {
      id,
      documentId,
      titel: title,
      inhoud: element.inhoud,
      nummer: element.nummer,
      layout,
      niveau,
      isOntwerp,
      isGereserveerd: !!element.gereserveerd,
      isVervallen: !!element.vervallen,
      annotationLink, // Annotaties worden later met deze link opgehaald (regeltekst/divisie link)
      type,
      elementen: stuctuurElementen.elementen,
      hasChildren: stuctuurElementen.hasChildren,
      apiSource: ApiSource.OZON,
      breadcrumbs,
    };
  }

  public mapDocumentStructuurElementen(
    element: DocumentComponent | OntwerpDocumentComponent,
    documentId: string,
    niveau: number,
    filteredElements: FilterElement[],
    documentViewContext: DocumentViewContext,
    documentSubPagePath: DocumentSubPagePath,
    layoutVM: LayoutStateVM = {},
    breadcrumbs: Breadcrumb[],
    expandedView: boolean
  ): { hasChildren: boolean; elementen: DocumentBodyElement[] } {
    if (!element?._embedded) {
      return {
        hasChildren: false,
        elementen: [],
      };
    }
    let elementen: (DocumentComponent | OntwerpDocumentComponent)[] = [];
    if (element?._embedded && 'documentComponenten' in element._embedded) {
      elementen = element._embedded.documentComponenten;
    } else if (element?._embedded && 'ontwerpDocumentComponenten' in element._embedded) {
      elementen = element._embedded.ontwerpDocumentComponenten;
    }

    /* Begrippen worden niet meegenomen als structuur elementen */
    elementen = elementen.filter(e => e.type !== DocumentBodyElementType.BEGRIP);

    let children;

    // isFilterMatch betekent dat er een match is tussen regeltekst/divisie en het structuur element
    // dit komt met name voor bij Regels op maat, maar ook bij filteren op thema's en hoofdlijnen
    const isFilterMatch = this.getIsFilterMatch(filteredElements, element);
    if (
      isFilterMatch ||
      [DocumentViewContext.VOLLEDIG_DOCUMENT, DocumentViewContext.TIJDELIJK_DEEL].includes(documentViewContext)
    ) {
      children = elementen;
    } else {
      children = elementen.filter(child => this.shouldRender(filteredElements, child));
    }

    const documentBodyElements = children.map(subElement =>
      this.mapDocumentStructuurElement(
        subElement,
        documentId,
        niveau,
        layoutVM,
        this.getIsFiltered(filteredElements, subElement),
        filteredElements,
        documentViewContext,
        documentSubPagePath,
        breadcrumbs.map(item => item),
        expandedView
      )
    );

    const conditieArtikel = (element as DocumentComponent).conditieArtikel;
    let conditieArtikelElement: DocumentBodyElement;
    if (conditieArtikel) {
      conditieArtikelElement = this.mapDocumentStructuurElement(
        {
          inhoud: conditieArtikel.inhoud,
          opschrift: '<Opschrift>Conditie</Opschrift>',
          identificatie: 'ConditieArtikel',
          expressie: null,
          type: DocumentBodyElementType.CONDITIEARTIKEL,
          volgordeNummer: null,
          _links: null,
        },
        documentId,
        niveau,
        layoutVM,
        true,
        filteredElements,
        documentViewContext,
        documentSubPagePath,
        [],
        expandedView
      );

      documentBodyElements.unshift(conditieArtikelElement); // Zet het conditieArtikel vooraan
    }

    return {
      hasChildren: !!children.length,
      elementen: documentBodyElements,
    };
  }

  /**
   * Op basis van de divisies, divisieteksten of regelteksten word een lijst van gefilterde elementId's samengesteld
   * Een lijst divisies, divisieteksten of regelteksten wordt aangemaakt door het klikken (bijv.) hoofdlijnen of thema's
   */
  public getFilterElementsForDivisies(list: DivisieannotatieEntity[]): FilterElement[] {
    if (!list?.length) {
      return [];
    }

    return list.map((item: DivisieannotatieEntity) => {
      const divisie = item.vastgesteld || item.ontwerp;
      return {
        identificatie: divisie.identificatie,
        kruimelpad: divisie.documentKruimelpad.map(kruimel => kruimel.identificatie),
      };
    });
  }

  public getFilterElementsForRegelteksten(list: RegeltekstEntity[]): FilterElement[] {
    if (!list?.length) {
      return [];
    }

    return list.map((item: RegeltekstEntity) => {
      const regeltekst = item.vastgesteld || item.ontwerp;
      return {
        identificatie: regeltekst.identificatie,
        kruimelpad: regeltekst.documentKruimelpad.map(kruimel => kruimel.identificatie),
      };
    });
  }

  public getFilterElementsForRegelsOpMaat(
    list: (Regeltekst | OntwerpRegeltekst | Divisieannotatie | OntwerpDivisieannotatie)[]
  ): FilterElement[] {
    if (!list) {
      return [];
    }
    return list.map((item: Regeltekst | OntwerpRegeltekst | Divisieannotatie | OntwerpDivisieannotatie) => ({
      identificatie: item.identificatie,
      kruimelpad: item.documentKruimelpad.map(kruimel => kruimel.identificatie),
    }));
  }

  private shouldRender = (
    filteredElements: FilterElement[],
    element: DocumentComponent | OntwerpDocumentComponent
  ): boolean => {
    if (!filteredElements?.length) {
      return true;
    }

    if (element.inhoud && !getEmbeddedComponents(element).length && !element.opschrift?.length) {
      // Als een element uit alleen maar inhoud bestaat, dan deze altijd renderen
      return true;
    }

    return this.getIsFiltered(filteredElements, element);
  };

  private getIsFiltered = (
    filteredElements: FilterElement[],
    element: DocumentComponent | OntwerpDocumentComponent
  ): boolean => {
    if (filteredElements?.length) {
      return filteredElements.some(filterElement => filterElement.kruimelpad.includes(element.identificatie));
    }
    // Er zijn geen filteredElements, dus alle elementen zijn gefilterd
    return true;
  };

  private getIsFilterMatch = (
    filteredElements: FilterElement[],
    element: DocumentComponent | OntwerpDocumentComponent
  ): boolean => {
    if (filteredElements?.length) {
      return filteredElements.some(filterElement => {
        const lastItem = filterElement.kruimelpad.length - 1;
        return filterElement.kruimelpad[lastItem] === element.identificatie;
      });
    }
    return true;
  };
}
