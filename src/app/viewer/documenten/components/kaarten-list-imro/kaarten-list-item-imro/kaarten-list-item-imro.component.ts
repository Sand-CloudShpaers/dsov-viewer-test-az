import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MapDetailsFacade } from '~viewer/documenten/+state/map-details.facade';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IMROCartografieInfoDetailVM } from '~viewer/documenten/types/map-details';

@Component({
  selector: 'dsov-kaarten-list-item-imro',
  templateUrl: './kaarten-list-item-imro.component.html',
  styleUrls: ['./kaarten-list-item-imro.component.scss'],
})
export class KaartenListItemImroComponent implements OnInit {
  @Input()
  item: IMROCartografieInfoDetailVM;

  @Input()
  groupKey: number;

  @Input()
  planId: string;

  @Output()
  public sliderToggled = new EventEmitter<{ item: IMROCartografieInfoDetailVM; checked: boolean; groupKey: number }>();

  public error: Error = null;
  public labels$: Observable<string[]>;

  constructor(private mapDetailsFacade: MapDetailsFacade) {}

  public ngOnInit(): void {
    if (this.item.type === 'Maatvoering') {
      this.labels$ = this.mapDetailsFacade.getMaatvoeringLabels$(this.item, this.planId).pipe(
        catchError(err => {
          this.error = err;
          return throwError(() => err);
        })
      );
    } else {
      this.labels$ = of(this.item.labels);
    }
  }

  public getThemas(): string {
    return this.item.themas.join(', ');
  }

  public onToggleSlider(item: IMROCartografieInfoDetailVM, checked: boolean, groupKey: number): void {
    this.sliderToggled.next({ item, checked, groupKey });
  }

  public addHighlight(objectId: string): void {
    this.mapDetailsFacade.addHighlight(this.planId, [objectId]);
  }

  public removeHighlight(): void {
    this.mapDetailsFacade.removeHighlight();
  }

  public trackByLabel(_index: number, label: string): string {
    return label;
  }

  public trackByVerwijzing(_index: number, verwijzing: string): string {
    return verwijzing;
  }

  public trackByLinkId(
    _index: number,
    internalLink: {
      href: string;
      id: string;
    }
  ): string {
    return internalLink.id;
  }

  public hasInternalLinks(): boolean {
    return this.item.internalLinks?.length > 0;
  }

  public hasExternalLinks(): boolean {
    return this.item.externalLinks?.length > 0;
  }

  public hasMultipleInternalLinks(): boolean {
    return this.item.internalLinks?.length > 1;
  }

  public hasMultipleExternalLinks(): boolean {
    return this.item.externalLinks?.length > 1;
  }
}
