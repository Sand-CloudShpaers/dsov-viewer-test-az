import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { HelpModalComponent } from '../help-modal/help-modal.component';
import { IntroductionService } from './introduction.service';

@Component({
  selector: 'dsov-introduction',
  templateUrl: './introduction.component.html',
})
export class IntroductionComponent implements OnInit {
  public introduction$: Observable<string>;

  @ViewChild(HelpModalComponent) public modal?: HelpModalComponent;

  constructor(private service: IntroductionService) {}

  public ngOnInit(): void {
    this.introduction$ = this.service.fetchIntroduction$();
  }

  public onShowIntroductionClicked(): void {
    if (this.modal) {
      this.modal.open();
    }
  }
}
