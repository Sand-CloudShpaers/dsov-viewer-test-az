import { Component, Input } from '@angular/core';
import { ApiSource } from '~model/internal/api-source';
import { SelectionObjectType } from '~store/common/selection/selection.model';
import { NormType } from '~viewer/annotaties/types/annotaties-enums';
import { SelectableListVM, SelectableVM } from '~viewer/components/selectable-list/types/selectable-list-item';
import { OmgevingsnormenVM, OmgevingsnormVM, OmgevingsnormwaardeVM } from '~viewer/normen/types/omgevingsnormenVM';
import { DocumentViewContext } from '~viewer/documenten/types/layout.model';

@Component({
  selector: 'dsov-normen',
  templateUrl: './normen.component.html',
})
export class NormenComponent {
  @Input() public documentViewContext: DocumentViewContext;
  @Input() public omgevingsnormen: OmgevingsnormenVM[];
  @Input() public normType: NormType;
  @Input() public showCheckboxes: boolean;
  @Input() public showSliders: boolean;
  @Input() public hideSubItems: boolean;

  public getNormen(item: OmgevingsnormenVM): SelectableListVM[] {
    return item?.normen?.map((norm: OmgevingsnormVM) => ({
      group:
        norm.normwaarden.length > 1
          ? {
              naam: norm.eenheid ? `${norm.naam} (in ${norm.eenheid})` : norm.naam,
              apiSource: ApiSource.OZON,
              identificatie: norm.identificatie,
              // Show label and symbol when context is set (i.e. not gebieden met regels)
              ...(this.documentViewContext
                ? {
                    subLabel: 'waarden worden weergegeven op de kaart',
                    symboolcode: 'meerdere-waarden',
                  }
                : null),
            }
          : undefined,
      items: norm.normwaarden.map((normwaarde: OmgevingsnormwaardeVM) => ({
        apiSource: ApiSource.OZON,
        id: normwaarde.identificatie,
        parentId: norm.identificatie,
        parentName: norm.naam,
        name: normwaarde.representationLabel,
        labelPrefix: this.getLabelPrefix(norm),
        objectType:
          norm.normType === NormType.OMGEVINGSNORMEN
            ? SelectionObjectType.OMGEVINGSNORM_NORMWAARDE
            : SelectionObjectType.OMGEVINGSWAARDE_NORMWAARDE,
        symboolcode: normwaarde.symboolcode,
        isSelected: normwaarde.isSelected,
        isOntwerp: normwaarde.isOntwerp,
        // Hide sub items when there is a context (i.e. not gebieden met regels) and not ROM
        ...(!!this.documentViewContext && this.documentViewContext !== DocumentViewContext.REGELS_OP_MAAT
          ? { isHidden: true }
          : undefined),
      })),
    }));
  }

  public getLabelPrefix(norm: OmgevingsnormVM): string {
    if (norm.normwaarden.length === 1) {
      return `${norm.naam}: `;
    } else if (this.documentViewContext === DocumentViewContext.REGELS_OP_MAAT) {
      return 'op gekozen locatie: ';
    }
    return undefined;
  }

  public trackByOmgevingsnormenVM(_index: number, item: OmgevingsnormenVM): string {
    return item.identificatie;
  }

  public trackBySelectableListVM(_index: number, item: SelectableVM): string {
    return item.identificatie;
  }
}
