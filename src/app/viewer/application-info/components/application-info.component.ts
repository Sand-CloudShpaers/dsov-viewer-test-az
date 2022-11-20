import { AfterViewInit, Component } from '@angular/core';
import { ApplicationInfo, ApplicationInfoModel } from '~store/common/application-info/types/application-info';
import { ApplicationPage } from '~store/common/navigation/types/application-page';
import { VersionNumberService } from '~viewer/components/version-number/version-number.service';
import { ApplicationInfoFacade } from '../application-info.facade';

@Component({
  selector: 'dsov-application-info',
  templateUrl: './application-info.component.html',
  styleUrls: ['./application-info.component.scss'],
})
export class ApplicationInfoComponent implements AfterViewInit {
  public open: boolean;
  public APPLICATION_PAGE = ApplicationPage;

  public versionNumber = this.versionNumberService.getBuildVersionNumber();
  public versionDate = this.versionNumberService.getBuildVersionDate();
  public status$ = this.applicationInfoFacade.applicationInfoStatus$;
  public applicationInfo$ = this.applicationInfoFacade.applicationInfo$;

  constructor(
    private applicationInfoFacade: ApplicationInfoFacade,
    private versionNumberService: VersionNumberService
  ) {}

  public ngAfterViewInit(): void {
    this.applicationInfoFacade.getApplicationInfo();
  }

  public trackByApplication(_index: number, item: ApplicationInfo): string {
    return item.name;
  }

  public trackByModel(_index: number, item: ApplicationInfoModel): string {
    return item.name;
  }
}
