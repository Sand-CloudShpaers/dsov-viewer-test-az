import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { StructuurElementFilter } from '~viewer/documenten/+state/structuurelement-filter/structuurelement-filter.model';
import { Observable } from 'rxjs';
import { DerivedLoadingState } from '~general/utils/store.utils';
import { DocumentenFacade } from '~viewer/documenten/+state/documenten.facade';

@Component({
  selector: 'dsov-structuur-elementen-filters',
  templateUrl: './structuur-elementen-filters.component.html',
  styleUrls: ['./structuur-elementen-filters.component.scss'],
})
export class StructuurElementenFiltersComponent implements OnInit {
  @Input()
  public documentId: string;

  @Output()
  public removeStructuurelementFilter = new EventEmitter<StructuurElementFilter>();

  public status$: Observable<DerivedLoadingState>;
  public filter$: Observable<StructuurElementFilter>;

  constructor(private documentenFacade: DocumentenFacade) {}

  public ngOnInit(): void {
    if (this.documentId) {
      this.status$ = this.documentenFacade.structuurElementFilterStatus$(this.documentId);
      this.filter$ = this.documentenFacade.structuurElementFilter$(this.documentId);
    }
  }

  public removeChip(structuurElementFilter: StructuurElementFilter): void {
    this.removeStructuurelementFilter.emit(structuurElementFilter);
  }

  public trackByStructuurElementFilter(_: number, item: StructuurElementFilter): string {
    return item.beschrijving;
  }
}
