import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { RegelsOpMaatFacade } from '~viewer/regels-op-maat/+state/regels-op-maat.facade';

@Component({
  selector: 'dsov-regels-op-maat-container',
  templateUrl: './regels-op-maat-container.component.html',
})
export class RegelsOpMaatContainerComponent implements OnInit {
  @Input() public activatedRouteSnapshot: ActivatedRouteSnapshot;

  public regelsOpMaatStatus$ = this.regelsOpMaatFacade.regelsOpMaatStatus$;
  public documentIds$ = this.regelsOpMaatFacade.documentIds$;

  constructor(private regelsOpMaatFacade: RegelsOpMaatFacade) {}

  public ngOnInit(): void {
    this.regelsOpMaatFacade.loadRegelsOpMaat();
  }

  public trackByFn(_index: number, documentId: string): string {
    return documentId;
  }
}
