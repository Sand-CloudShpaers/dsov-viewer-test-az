import { Component, Input, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ApplicationTitle } from '~store/common/navigation/types/application-page';
import { LocatieFilter } from '~viewer/filter/types/filter-options';

@Component({
  selector: 'dsov-filter-location',
  templateUrl: './filter-location.component.html',
})
export class FilterLocationComponent implements OnInit {
  @Input() public locatieFilter: LocatieFilter;
  @Input() public page: string;

  constructor(private titleService: Title) {}

  ngOnInit(): void {
    if (this.locatieFilter && this.page) {
      this.titleService.setTitle(`${this.locatieFilter.name}: ${this.page} - ${ApplicationTitle}`);
    }
  }
}
