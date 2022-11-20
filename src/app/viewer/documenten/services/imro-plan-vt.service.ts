import { ConfigService } from '~services/config.service';
import { Observable } from 'rxjs';
import { ImroPlanResponse } from '~viewer/documenten/+state/kaarten-imro/kaarten-imro.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Style } from 'mapbox-gl';

@Injectable({
  providedIn: 'root',
})
export class ImroPlanVtService {
  constructor(private configService: ConfigService, private httpClient: HttpClient) {}

  public getImroPlanStyleConfigs$(id: string): Observable<ImroPlanResponse> {
    return this.httpClient.get<ImroPlanResponse>(`${this.configService.config.pdokRuimtelijkeplannen.url}/${id}/`);
  }

  public getStyle$(href: string): Observable<Style> {
    return this.httpClient.get<Style>(href);
  }
}
