import { Component, OnDestroy } from '@angular/core';
import { DocumentenFacade } from '~viewer/documenten/+state/documenten.facade';
import { KaartService } from '~viewer/kaart/services/kaart.service';

@Component({
  selector: 'dsov-document-objectinformation-page',
  templateUrl: './document-objectinformation-page.component.html',
  styleUrls: ['./document-objectinformation-page.component.scss'],
})
export class DocumentObjectinformationPageComponent implements OnDestroy {
  public documentDto$ = this.facade.currentDocumentDto$;
  public kaartFeatures$ = this.kaartService.featuresAtLocation;

  constructor(private facade: DocumentenFacade, public kaartService: KaartService) {}

  ngOnDestroy(): void {
    this.kaartService.resetFeaturesAtLocation();
  }
}
