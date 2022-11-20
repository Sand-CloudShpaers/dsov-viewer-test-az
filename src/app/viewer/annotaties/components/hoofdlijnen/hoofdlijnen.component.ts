import { Component, Input } from '@angular/core';
import { AnnotatieHoofdlijnenVM } from '~viewer/annotaties/types/hoofdlijnen';
import { ApiSource } from '~model/internal/api-source';
import { SelectableListVM } from '~viewer/components/selectable-list/types/selectable-list-item';

@Component({
  selector: 'dsov-hoofdlijnen',
  templateUrl: './hoofdlijnen.component.html',
})
export class HoofdlijnenComponent {
  @Input()
  public hoofdlijnen: AnnotatieHoofdlijnenVM[];

  public getHoofdlijnen(item: AnnotatieHoofdlijnenVM): SelectableListVM[] {
    return [
      {
        items: item.hoofdlijnen.map(hoofdlijn => ({
          id: hoofdlijn.identificatie,
          name: hoofdlijn.naam,
          representationType: null,
          apiSource: ApiSource.OZON,
          isSelected: false,
          isOntwerp: hoofdlijn.isOntwerp,
        })),
      },
    ];
  }

  public trackByFn(_index: number, item: AnnotatieHoofdlijnenVM): string {
    return item.identificatie;
  }
}
