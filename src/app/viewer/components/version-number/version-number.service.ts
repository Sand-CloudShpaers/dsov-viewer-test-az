import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { tap } from 'rxjs/operators';
import { NoCacheHeaders } from '~services/no-cache-headers';

@Injectable()
export class VersionNumberService {
  private static buildVersionFile = 'config/build_version';
  private buildVersion: string;

  constructor(private http: HttpClient) {}

  public getBuildVersion(): string {
    return this.buildVersion;
  }

  public getBuildVersionNumber(): string {
    return this.buildVersion.substring(0, this.buildVersion.indexOf(' '));
  }

  public getBuildVersionDate(): Date {
    const buildversionDate = this.buildVersion.trim().split(' ');
    return new Date(buildversionDate[1]);
  }

  public loadVersion(): Promise<string> {
    return lastValueFrom(
      this.http
        .get(VersionNumberService.buildVersionFile, {
          responseType: 'text',
          headers: NoCacheHeaders,
        })
        .pipe(tap(version => (this.buildVersion = version)))
    );
  }
}
