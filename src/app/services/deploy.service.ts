import { Injectable } from '@angular/core';
import { map, take, tap } from 'rxjs/operators';
import { DeployResponse } from '~config/deploy.conf';
import { Deploy } from '~model/deploy';
import { DeployProvider } from '~providers/deploy.provider';

@Injectable({ providedIn: 'root' })
export class DeployService {
  public deploy?: Deploy;
  private fetchDeployParameters$ = this.deployProvider.deployParameters$.pipe(
    map(deployParameters => this.transformDeployParameters(deployParameters)),
    tap(deploy => {
      this.deploy = deploy;
    })
  );
  private deployDefault: Deploy = new Deploy(false, false, false);

  constructor(private deployProvider: DeployProvider) {}

  private static getDeployValue(defaultValue: boolean, value = ''): boolean {
    let result = defaultValue;
    switch (value.trim().toLowerCase()) {
      case 'true':
        result = true;
        break;
      case 'false':
        result = false;
        break;
    }
    return result;
  }

  public fetchDispatchDeployParameters(): void {
    this.fetchDeployParameters$.pipe(take(1)).subscribe();
  }

  private transformDeployParameters(response?: DeployResponse): Deploy {
    return new Deploy(
      DeployService.getDeployValue(this.deployDefault.betaContent, response.betacontent),
      DeployService.getDeployValue(this.deployDefault.ozonProcedureStatus, response.ozonprocedurestatus),
      DeployService.getDeployValue(this.deployDefault.ozonOmgevingsVisieMock, response.ozonomgevingsvisiemock)
    );
  }
}
