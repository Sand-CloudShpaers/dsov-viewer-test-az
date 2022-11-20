import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { RegelsOpMaatFacade } from '~viewer/regels-op-maat/+state/regels-op-maat.facade';
import { DerivedLoadingState } from '~general/utils/store.utils';
import { RegelsOpMaatDocument } from '~viewer/regels-op-maat/types/regels-op-maat-document';
import { ApiUtils } from '~general/utils/api.utils';

@Component({
  selector: 'dsov-regels-op-maat',
  templateUrl: './regels-op-maat.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegelsOpMaatComponent implements OnInit {
  @Input()
  public documentId: string;

  public ApiUtils = ApiUtils;

  public regelsOpMaatdocumentStatus$: Observable<DerivedLoadingState>;
  public regelsOpMaatDocument$: Observable<RegelsOpMaatDocument>;

  constructor(private regelsOpMaatFacade: RegelsOpMaatFacade) {}

  public ngOnInit(): void {
    this.regelsOpMaatdocumentStatus$ = this.regelsOpMaatFacade.documentStatus$(this.documentId);
    this.regelsOpMaatDocument$ = this.regelsOpMaatFacade.selectRegelsOpMaatDocument$(this.documentId);
  }
}
