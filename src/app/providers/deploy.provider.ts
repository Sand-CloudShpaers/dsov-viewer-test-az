import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { DeployResponse } from '~config/deploy.conf';

@Injectable({ providedIn: 'root' })
export class DeployProvider {
  public deployParameters$ = this.http
    .get<DeployResponse>('config/deploy.conf')
    .pipe(shareReplay({ bufferSize: 1, refCount: true }));

  constructor(private http: HttpClient) {}

  public loadDeployParameters(): Promise<DeployResponse> {
    return lastValueFrom(this.deployParameters$);
  }
}
