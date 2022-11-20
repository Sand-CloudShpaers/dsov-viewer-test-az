import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ContactinfoService } from './contactinfo.service';

@Component({
  selector: 'dsov-contactinfo',
  templateUrl: './contactinfo.component.html',
})
export class ContactinfoComponent {
  public contactinfo$: Observable<string>;

  constructor(service: ContactinfoService) {
    this.contactinfo$ = service.fetchContactinfo$();
  }
}
