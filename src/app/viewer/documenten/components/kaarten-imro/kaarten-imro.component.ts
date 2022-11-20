import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MapDetailsFacade } from '~viewer/documenten/+state/map-details.facade';
import { DocumentenFacade } from '~viewer/documenten/+state/documenten.facade';
import { ImroKaartStyleConfig } from '~viewer/documenten/+state/kaarten-imro/kaarten-imro.model';
import { ImroPlanlagenService } from '~viewer/kaart/services/imro-planlagen.service';

@Component({
  selector: 'dsov-kaarten-imro',
  templateUrl: './kaarten-imro.component.html',
  styleUrls: ['./kaarten-imro.component.scss'],
})
export class KaartenImroComponent implements OnInit, OnDestroy {
  @Input()
  public documentId: string;

  public mapDetailsStatus$ = this.mapDetailsFacade.mapDetailsStatus$;
  public cartografieSummaryGroups$ = this.mapDetailsFacade.mapDetails$;
  public imroKaartStyleConfigs$: Observable<ImroKaartStyleConfig[]>;
  public firstSet = false;
  public activeConfig = 0;

  constructor(
    private documentenFacade: DocumentenFacade,
    private imroPlanlagenService: ImroPlanlagenService,
    private mapDetailsFacade: MapDetailsFacade
  ) {}

  public ngOnInit(): void {
    this.mapDetailsFacade.loadCartografie(this.documentId, []);
    this.imroKaartStyleConfigs$ = this.documentenFacade.imroKaartStyleConfigs$(this.documentId);
  }

  public ngOnDestroy(): void {
    this.mapDetailsFacade.showMapDetails([], this.documentId);
  }

  public setFirstConfigActive(configs: ImroKaartStyleConfig[]): void {
    if (!this.firstSet) {
      if (configs.length) {
        this.firstSet = true;
        this.imroPlanlagenService.applyKaartStyle(this.documentId, configs[0]);
      }
    }
  }

  public onToggleSlider(configs: ImroKaartStyleConfig[], config: ImroKaartStyleConfig, checked: boolean): void {
    configs.forEach(conf => {
      if (conf.id === config.id) {
        if (checked) {
          this.activeConfig = configs.indexOf(conf);
          this.imroPlanlagenService.applyKaartStyle(this.documentId, config);
        } else {
          this.imroPlanlagenService.resetLagen([this.documentId], false);
        }
      }
    });
  }

  public getKaartTitle(config: ImroKaartStyleConfig): string {
    if (config.naam === this.documentId) {
      return 'Plankaart';
    }
    return config.naam;
  }

  public trackByConfigId(index: number, obj: { id: string; naam: string; url: string }): string {
    return obj.id;
  }
}
