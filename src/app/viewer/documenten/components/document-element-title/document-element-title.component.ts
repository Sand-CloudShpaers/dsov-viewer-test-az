import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DocumentBodyElement, DocumentBodyElementType } from '~viewer/documenten/types/documenten.model';

@Component({
  selector: 'dsov-document-element-title',
  templateUrl: './document-element-title.component.html',
  styleUrls: ['./document-element-title.component.scss'],
})
export class DocumentElementTitleComponent implements OnInit {
  @Input() public documentBodyElement: DocumentBodyElement;
  @Input() public isOpen: boolean;
  @Output() public clickedToggle = new EventEmitter<boolean>();
  @Input() public expandedView: boolean;
  @Input() public showToggle: boolean;

  public externeReferentieLink: string;

  public tagName = 'p';

  public ngOnInit(): void {
    this.showToggle = this.documentBodyElement.layout.showToggle;
    this.externeReferentieLink = this.documentBodyElement.externeReferentieLinkIHR;
    this.tagName = this.getTagName(this.documentBodyElement.type, this.documentBodyElement.niveau);
  }

  /*
   * Aan de hand van het "soort" ( = type) titel wordt er een HTML header tag terug gegeven
   * indien het soort "FORMELE_DIVISIE" is, dan wordt er gekeken naar het niveau ( = level)
   * indien geen van de criteria overeenkomt is de tag een paragraaf ("p")
   */
  public getTagName(type: DocumentBodyElementType, niveau: number): string {
    switch (type) {
      case DocumentBodyElementType.HOOFDSTUK:
      case DocumentBodyElementType.ALGEMENE_TOELICHTING:
      case DocumentBodyElementType.ARTIKELGEWIJZE_TOELICHTING:
      case DocumentBodyElementType.AANHEF:
      case DocumentBodyElementType.SLUITING:
      case DocumentBodyElementType.CONDITIEARTIKEL:
        return 'h2';
      case DocumentBodyElementType.TITEL:
        return 'h3';
      case DocumentBodyElementType.AFDELING:
        return 'h4';
      case DocumentBodyElementType.PARAGRAAF:
      case DocumentBodyElementType.SUBPARAGRAAF:
      case DocumentBodyElementType.SUBSUBPARAGRAAF:
        return 'h5';
      case DocumentBodyElementType.ARTIKEL:
        return 'h6';
      case DocumentBodyElementType.DIVISIETEKST:
      case DocumentBodyElementType.DIVISIE:
      case DocumentBodyElementType.BIJLAGE:
        if (niveau > 0) {
          switch (niveau) {
            case 2:
              return 'h2';
            case 3:
              return 'h3';
            case 4:
              return 'h4';
            case 5:
              return 'h5';
            case 6:
              return 'h6';
            default:
              return 'p';
          }
        } else {
          return 'p';
        }
      default:
        return 'p';
    }
  }

  public toggle(isOpen: boolean): void {
    this.clickedToggle.emit(isOpen);
  }

  public getTitleAttribute(isOpen: boolean): string {
    return `Tekst ${isOpen ? 'dicht' : 'open'} klappen`;
  }

  public getInteractive(documentBodyElement: DocumentBodyElement): string {
    return documentBodyElement.layout.isActive
      ? documentBodyElement.type === DocumentBodyElementType.ARTIKEL
        ? 'sub'
        : 'true'
      : null;
  }
}
