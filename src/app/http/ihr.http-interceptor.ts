import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ConfigService } from '~services/config.service';
import { PlanCollectie } from '~ihr-model/planCollectie';

@Injectable()
export class IhrHttpInterceptor implements HttpInterceptor {
  constructor(private configService: ConfigService) {}

  intercept(request: HttpRequest<never>, next: HttpHandler): Observable<HttpEvent<PlanCollectie>> {
    if (this.configService.config?.ihr.disabled && request.url.includes(this.configService.config.ihr.url)) {
      let response: HttpResponse<PlanCollectie>;
      if (request.url.includes('/plannen/_zoek')) {
        response = new HttpResponse({ status: 200, body: planCollectieEmpty });
      } else if (request.url.includes('/plannen/NL.IMRO.')) {
        response = new HttpResponse({ status: 200, body: null });
      }
      return of(response);
    }
    return next.handle(request);
  }
}

const planCollectieEmpty: PlanCollectie = {
  _embedded: {
    plannen: [],
  },
  _links: {
    self: {
      href: '',
    },
  },
};
