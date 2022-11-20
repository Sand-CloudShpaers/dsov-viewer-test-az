import { Component, OnDestroy, OnInit } from '@angular/core';
import { defineCustomElements } from '@dso-toolkit/core/loader';
import { Subject } from 'rxjs';
import { PortaalService } from '~portaal/portaal.service';
import { DeployService } from '~services/deploy.service';

@Component({
  selector: 'dsov-viewer-root',
  templateUrl: './dsov.component.html',
  providers: [PortaalService],
})
export class DsovComponent implements OnInit, OnDestroy {
  private onDestroy$ = new Subject<void>();

  constructor(private deployService: DeployService, private portaalService: PortaalService) {
    defineCustomElements();
  }

  public ngOnInit(): void {
    this.deployService.fetchDispatchDeployParameters();
    this.portaalService.initMessageChannel();
  }

  public ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
    this.portaalService.destroyMessageChannel();
  }
}
