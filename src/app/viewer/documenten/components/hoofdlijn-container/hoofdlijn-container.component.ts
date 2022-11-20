import { Component, Input, OnInit } from '@angular/core';
import { DocumentenFacade } from '~viewer/documenten/+state/documenten.facade';
import { Observable } from 'rxjs';
import { FilterType } from '~viewer/documenten/utils/document-utils';
import { KeyValue } from '@angular/common';
import { DocumentDto } from '~viewer/documenten/types/documentDto';
import { HoofdlijnVM } from '~viewer/documenten/+state/hoofdlijnen/hoofdlijnen.model';

@Component({
  selector: 'dsov-hoofdlijn-container',
  templateUrl: './hoofdlijn-container.component.html',
  styleUrls: ['./hoofdlijn-container.component.scss'],
})
export class HoofdlijnContainerComponent implements OnInit {
  @Input() public document: DocumentDto;
  @Input() public hoofdlijnen: Record<string, HoofdlijnVM[]>;

  public openHoofdlijnen: string[] = [];
  public routerLink$: Observable<string>;

  constructor(private documentenFacade: DocumentenFacade) {}

  public groupClicked(soort: string): void {
    if (this.openHoofdlijnen.includes(soort)) {
      this.openHoofdlijnen = this.openHoofdlijnen.filter(item => item !== soort);
    } else {
      this.openHoofdlijnen.push(soort);
    }
  }

  public ngOnInit(): void {
    this.routerLink$ = this.documentenFacade.filterTabRouterLink$(this.document?.documentId);
  }

  public onClickHoofdlijn(hoofdlijn: HoofdlijnVM): void {
    this.documentenFacade.setStructuurelementFilter({
      id: this.document.documentId,
      document: this.document,
      beschrijving: hoofdlijn.naam,
      hoofdlijnId: hoofdlijn.identificatie,
      filterType: FilterType.hoofdlijn,
    });
  }

  public trackByKey = (_index: number, soort: KeyValue<string, Array<HoofdlijnVM>>): string => soort.key;
  public trackById = (_index: number, item: HoofdlijnVM): string => item.identificatie;
}
