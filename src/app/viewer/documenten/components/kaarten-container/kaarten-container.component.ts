import { Component, Input, OnInit } from '@angular/core';
import { DocumentenFacade } from '~viewer/documenten/+state/documenten.facade';
import { ApiSource } from '~model/internal/api-source';
import { Observable } from 'rxjs';

@Component({
  selector: 'dsov-kaarten-container',
  templateUrl: './kaarten-container.component.html',
  styleUrls: ['./kaarten-container.component.scss'],
})
export class KaartenContainerComponent implements OnInit {
  @Input()
  public documentId: string;

  public apiSource$: Observable<ApiSource>;
  public ApiSource = ApiSource;

  constructor(private documentenFacade: DocumentenFacade) {}

  ngOnInit(): void {
    this.apiSource$ = this.documentenFacade.apiSource$(this.documentId);
  }
}
