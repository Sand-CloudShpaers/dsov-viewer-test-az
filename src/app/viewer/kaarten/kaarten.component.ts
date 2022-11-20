import { Component, Input } from '@angular/core';
import { ApiSource } from '~model/internal/api-source';
import { SelectableListVM } from '~viewer/components/selectable-list/types/selectable-list-item';
import { KaartVM } from '~viewer/annotaties/types/kaartenVM';
import { SelectionObjectType } from '~store/common/selection/selection.model';

@Component({
  selector: 'dsov-kaarten',
  templateUrl: './kaarten.component.html',
  styleUrls: ['./kaarten.component.scss'],
})
export class KaartenComponent {
  @Input()
  public kaarten: KaartVM[];
  @Input()
  public documentId: string;

  public getIsExpanded(kaart: KaartVM): boolean {
    return kaart.kaartlagen.some(laag => laag.isSelected);
  }

  public trackByFn(_index: number, item: KaartVM): string {
    return item.identificatie;
  }

  public getKaartLagen(kaart: KaartVM): SelectableListVM[] {
    return [
      {
        items: kaart.kaartlagen
          .map(laag => ({
            id: laag.identificatie,
            parentId: kaart.identificatie,
            document: {
              documentId: this.documentId,
            },
            name: laag.naam,
            apiSource: ApiSource.OZON,
            symboolcode: laag.symboolcode,
            objectType: SelectionObjectType.KAART_KAARTLAAG,
            isSelected: laag.isSelected,
            isOntwerp: kaart.isOntwerp,
            niveau: laag.niveau,
          }))
          .sort((a, b) => b.niveau - a.niveau),
      },
    ];
  }
}
