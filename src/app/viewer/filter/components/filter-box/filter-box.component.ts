import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FilterOptions } from '../../types/filter-options';
import { ContentService } from '~services/content.service';
import { ContentComponentBase } from '~general/components/content-component-base/content-component-base';

@Component({
  selector: 'dsov-filter-box',
  templateUrl: './filter-box.component.html',
  styleUrls: ['./filter-box.component.scss'],
})
export class FilterBoxComponent extends ContentComponentBase {
  @Input() public description: string;
  @Input() public filterOptions: FilterOptions;
  @Input() public title: string;
  @Input() public toggleTipKey: string;

  @Output() public leave = new EventEmitter();

  constructor(protected contentService: ContentService) {
    super(contentService);
  }

  public isActive(): string {
    if (this.filterOptions && Object.values(this.filterOptions).some(value => !!value.length)) {
      return '';
    }
    return null;
  }

  public edit(): void {
    this.leave.emit();
  }
}
