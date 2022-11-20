import { Injectable } from '@angular/core';
import { Breadcrumb, DocumentBodyElement, DocumentBodyElementType } from '~viewer/documenten/types/documenten.model';
import {
  DerivedLayoutState,
  DocumentElementenLayoutVM,
  DocumentViewContext,
  LayoutStateVM,
} from '~viewer/documenten/types/layout.model';
import { Tekst } from '~ihr-model/tekst';
import { ApiSource } from '~model/internal/api-source';
import { AnnotationVM } from '~viewer/documenten/types/annotation';
import { SelectionObjectType } from '~store/common/selection/selection.model';

@Injectable()
export class DocumentStructuurIhrService {
  public static mapDocumentStructuurElement(
    tekst: Tekst,
    artikelen: Tekst[],
    niveau: number,
    layoutVM: LayoutStateVM,
    documentViewContext: DocumentViewContext,
    breadcrumbs: Breadcrumb[],
    documentId: string
  ): DocumentBodyElement {
    const elementLayout = layoutVM ? layoutVM[tekst.id] : undefined;
    const isBijlage =
      !tekst._embedded?.children?.length && !tekst._links?.children?.length && !tekst.inhoud && tekst.externeReferentie;
    const soort = isBijlage ? DocumentBodyElementType.BIJLAGE : DocumentStructuurIhrService.getSoort(niveau);

    let elementen: DocumentBodyElement[] = [];
    let hasChildren = false;

    breadcrumbs.push({
      id: tekst.id,
      titel: tekst.titel,
    });

    let children = tekst._embedded?.children;

    if (children?.length) {
      if (documentViewContext === DocumentViewContext.REGELS_OP_MAAT) {
        /*    Bij Regels Op Maat worden de Teksten binnen het document gefilterd met behulp
         *     van de opgehaalde artikelen die een referentie hebben met de zoek criteria
         */
        children = children.filter(child => this.getIsFiltered(child.id, niveau + 1, artikelen));
      }

      const stuctuurElementen = DocumentStructuurIhrService.mapDocumentStructuurElementen(
        children,
        artikelen,
        niveau + 1,
        documentViewContext,
        layoutVM,
        breadcrumbs,
        documentId
      );

      elementen = stuctuurElementen.elementen;
      hasChildren = stuctuurElementen.hasChildren;
    } else {
      /*  IHR teksten kunnen wel een referentie hebben naar onderliggende kinderen, die niet embedded zijn.
       *   Die moeten nog opgehaald worden in een later stadium
       */
      hasChildren = tekst._links?.children?.length > 0;
    }

    const layout = DocumentStructuurIhrService.getLayoutState(
      tekst,
      soort,
      elementen.length > 0,
      artikelen,
      documentViewContext,
      niveau,
      elementLayout
    );

    const annotation = DocumentStructuurIhrService.getAttributes(tekst, documentId);

    return {
      id: tekst.id,
      documentId,
      titel: { content: tekst.titel },
      inhoud: tekst.inhoud,
      layout,
      niveau,
      elementen,
      isOntwerp: false,
      isGereserveerd: false,
      isVervallen: false,
      annotationLink: null,
      annotation,
      type: soort,
      hasChildren,
      apiSource: ApiSource.IHR,
      breadcrumbs,
      externeReferentieLinkIHR: tekst.externeReferentie?.href,
    };
  }

  public static mapDocumentStructuurElementen(
    teksten: Tekst[],
    artikelen: Tekst[],
    niveau: number,
    documentViewContext: DocumentViewContext,
    layoutVM: LayoutStateVM = {},
    breadcrumbs: Breadcrumb[],
    documentId: string
  ): { hasChildren: boolean; elementen: DocumentBodyElement[] } {
    if (teksten.length === 0) {
      return {
        hasChildren: false,
        elementen: [],
      };
    }

    return {
      hasChildren: true,
      elementen: teksten.map(tekst =>
        DocumentStructuurIhrService.mapDocumentStructuurElement(
          tekst,
          artikelen,
          niveau,
          layoutVM,
          documentViewContext,
          breadcrumbs.map(item => item),
          documentId
        )
      ),
    };
  }

  public static getLayoutState(
    tekst: Tekst,
    soort: DocumentBodyElementType,
    hasChildren: boolean,
    artikelen: Tekst[],
    documentViewContext: DocumentViewContext,
    niveau: number,
    elementLayout?: DerivedLayoutState
  ): DocumentElementenLayoutVM {
    const isLichaam = soort === DocumentBodyElementType.LICHAAM;
    const isHoofdstuk = soort === DocumentBodyElementType.HOOFDSTUK;
    const isArtikel = soort === DocumentBodyElementType.AFDELING;

    // Een tekst is collapsable wanneer een document een titel heeft en ook inhoud of onderliggende links
    const isCollapsible = !!tekst.titel && (!!tekst.inhoud || tekst._links?.children?.length > 0);
    const currentCollapse = elementLayout?.collapse?.isOpen ?? false;

    const hasRepresentation =
      tekst._links.bestemmingsvlakken.length > 0 ||
      tekst._links.bouwaanduidingen.length > 0 ||
      tekst._links.functieaanduidingen.length > 0 ||
      tekst._links.gebiedsaanduidingen.length > 0 ||
      tekst._links.lettertekenaanduidingen.length > 0 ||
      tekst._links.maatvoeringen.length > 0;
    const hasStatusGereserveerd = false;
    const showNumberOnly = false;
    const showAnnotation = elementLayout?.annotaties?.isOpen ?? false;

    let isFiltered = true;
    let isOpen = isLichaam ? true : currentCollapse;
    let showTitle = isLichaam ? false : !!tekst.titel;
    let showContent = hasStatusGereserveerd || !!tekst.inhoud;
    let showBreadcrumbs = false;

    if (tekst.externeReferentie?.href && !tekst._links?.children?.length) {
      showTitle = false;
    }

    if (documentViewContext === DocumentViewContext.REGELS_OP_MAAT) {
      isFiltered = isArtikel ? this.getIsFiltered(tekst.id, niveau, artikelen) : true;
      if (isLichaam || isHoofdstuk) {
        showTitle = false;
        isOpen = true;
        showContent = false;
      }
      showBreadcrumbs = soort === DocumentBodyElementType.AFDELING;
    }

    return {
      documentViewContext: documentViewContext,
      showContent,
      showElementen: hasChildren,
      showToggle: true,
      showNumberOnly,
      showTitle,
      isCollapsible,
      isFiltered,
      isOpen,
      showAnnotation,
      hasAnnotation: hasRepresentation,
      showBreadcrumbs,
      isEmptyParagraph: false,
      isActive: true,
    };
  }

  private static getIsFiltered = (identificatie: string, niveau: number, artikelen: Tekst[]): boolean => {
    if (!artikelen?.length) {
      /* Geen artikelen, alles is uitgefilterd */
      return false;
    }
    /* Dit is een beetje verwarrend, in de viewer zie je 'Artikel...', met technische gezien is het qua niveau een afdeling */
    if (DocumentStructuurIhrService.getSoort(niveau) === DocumentBodyElementType.AFDELING) {
      return artikelen.some(artikel => artikel.id === identificatie);
    }
    /* Alles van een ander type is standaard gefilterd en wordt getoond */
    return true;
  };

  private static getSoort(niveau: number): DocumentBodyElementType {
    switch (niveau) {
      case 0:
        return DocumentBodyElementType.LICHAAM;
      case 1:
        return DocumentBodyElementType.HOOFDSTUK;
      case 2:
        return DocumentBodyElementType.AFDELING;
      case 3:
        return DocumentBodyElementType.ARTIKEL;
      default:
        return DocumentBodyElementType.PLATTE_TEKST;
    }
  }

  private static getAttributes(tekst: Tekst, documentId: string): AnnotationVM {
    return {
      annotationId: {
        identificatie: documentId + '##' + tekst.id,
        elementId: tekst.id,
      },
      vastgesteld: {
        features: [
          {
            objectType: SelectionObjectType.BESTEMMINGSVLAK,
            hrefs: tekst._links.bestemmingsvlakken?.map(x => x.href),
          },
          {
            objectType: SelectionObjectType.BOUWAANDUIDING,
            hrefs: tekst._links.bouwaanduidingen?.map(x => x.href),
          },
          {
            objectType: SelectionObjectType.FUNCTIEAANDUIDING,
            hrefs: tekst._links.functieaanduidingen?.map(x => x.href),
          },
          {
            objectType: SelectionObjectType.GEBIEDSAANDUIDING,
            hrefs: tekst._links.gebiedsaanduidingen?.map(x => x.href),
          },
          {
            objectType: SelectionObjectType.MAATVOERING,
            hrefs: tekst._links.maatvoeringen?.map(x => x.href),
          },
          {
            objectType: SelectionObjectType.LETTERTEKENAANDUIDING,
            hrefs: tekst._links.lettertekenaanduidingen,
          },
        ],
      },
    };
  }
}
