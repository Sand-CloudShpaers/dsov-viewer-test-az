import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DerivedLoadingState } from '~general/utils/store.utils';
import { DocumentenFacade } from '~viewer/documenten/+state/documenten.facade';
import { KaartVM } from '~viewer/annotaties/types/kaartenVM';

@Component({
  selector: 'dsov-kaarten-ozon',
  templateUrl: './kaarten-ozon.component.html',
  styleUrls: [],
})
export class KaartenOzonComponent implements OnInit {
  @Input()
  public documentId: string;

  public kaarten$: Observable<KaartVM[]>;
  public kaartenStatus$: Observable<DerivedLoadingState>;

  constructor(private documentenFacade: DocumentenFacade) {}

  public ngOnInit(): void {
    this.documentenFacade.loadKaarten(this.documentId);

    this.kaarten$ = this.documentenFacade.kaartenByDocumentId$(this.documentId);
    this.kaartenStatus$ = this.documentenFacade.kaartenStatus$(this.documentId);
  }
}
