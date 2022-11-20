import { Component, Input, OnInit } from '@angular/core';
import { ApiSource } from '~model/internal/api-source';
import { SelectionFacade } from '~store/common/selection/+state/selection.facade';
import { Selection, SelectionObjectType } from '~store/common/selection/selection.model';
import { FilterFacade } from '~viewer/filter/filter.facade';
import { ActiviteitenGroepVM, ActiviteitVM } from '~viewer/gebieds-info/types/gebieds-info.model';

@Component({
  selector: 'dsov-activiteiten-list',
  templateUrl: './activiteiten-list.component.html',
  styleUrls: ['./activiteiten-list.component.scss'],
})
export class ActiviteitenListComponent implements OnInit {
  @Input() public activeSelections: Selection[];
  @Input() public activiteitenGroepen: ActiviteitenGroepVM[];

  public activiteiten: ActiviteitVM[] = [];
  public openGroepen: string[] = [];

  constructor(private filterFacade: FilterFacade, private selectionFacade: SelectionFacade) {}

  public ngOnInit(): void {
    this.activiteitenGroepen.forEach(groep => {
      this.activiteiten = this.activiteiten.concat(groep.activiteiten);
    });
  }

  public getSelectedItems(activeSelections: Selection[]): number {
    return activeSelections.length;
  }

  public getGroupIsOpen(group: ActiviteitenGroepVM): boolean {
    return this.openGroepen.includes(group.code) || group.activiteiten.some(activiteit => this.getChecked(activiteit));
  }

  public getChecked(activiteit: ActiviteitVM): boolean {
    return this.activeSelections.some(selection => selection.id === activiteit.identificatie);
  }

  public getDescription(): string {
    if (this.getSelectedActiviteiten().length === 1) {
      return '1 activiteit geselecteerd';
    } else if (this.getSelectedActiviteiten().length > 1) {
      return this.getSelectedActiviteiten().length + ' activiteiten geselecteerd';
    } else if (this.activiteiten.length === 1) {
      return '1 activiteit';
    } else {
      return this.activiteiten.length + ' activiteiten';
    }
  }

  public getTitle(groep: ActiviteitenGroepVM): string {
    return groep.waarde.charAt(0).toUpperCase() + groep.waarde.slice(1);
  }

  public viewSelection(): void {
    this.filterFacade.openActiviteitFilter(this.getSelectedActiviteiten());
  }

  public onToggleGroep(code: string): void {
    const indexOf = this.openGroepen.indexOf(code);
    indexOf === -1 ? this.openGroepen.push(code) : this.openGroepen.splice(indexOf, 1);
  }

  public onToggleCheckbox(activiteit: ActiviteitVM, event: Event): void {
    const target = event.target as HTMLInputElement;
    const selection: Selection = {
      id: activiteit.identificatie,
      apiSource: ApiSource.OZON,
      name: activiteit.naam,
      objectType: SelectionObjectType.ACTIVITEIT,
    };
    if (target.checked) {
      this.selectionFacade.addSelections([selection]);
    } else {
      this.selectionFacade.removeSelections([selection]);
    }
  }

  public trackByGroep(_index: number, item: ActiviteitenGroepVM): string {
    return item.code;
  }

  public trackByActiviteit(_index: number, item: ActiviteitVM): string {
    return item.identificatie;
  }

  private getSelectedActiviteiten(): ActiviteitVM[] {
    return this.activiteiten.filter(activiteit => this.activeSelections.some(x => x.id === activiteit.identificatie));
  }
}
