import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DisplayErrorInfoMessagesService } from '~services/display-error-info-messages.service';
import { DisplayMessagePayload } from '~model/display-error-message';

const MESSAGE_VISIBILITY_DURATION = 6000;

@Component({
  selector: 'dsov-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit, OnDestroy {
  public messages: DisplayMessagePayload[] = [];
  public text = '';
  public info = '';
  private readonly onDestroy$ = new Subject<void>();

  constructor(private messageService: DisplayErrorInfoMessagesService) {}

  @HostListener('document:click', ['$event', '$event.target'])
  public onClick(_event: MouseEvent, targetElement: HTMLElement): void {
    if (!targetElement) {
      return;
    }
    if (!targetElement.closest('.dso-message')) {
      this.messages = [];
    }
  }

  public ngOnInit(): void {
    this.messageService.messages$.pipe(takeUntil(this.onDestroy$)).subscribe(message => {
      const uniqid = Date.now();
      const timeout = window.setTimeout(() => {
        this.messages.splice(
          this.messages.findIndex(o => o.id === uniqid),
          1
        );
      }, MESSAGE_VISIBILITY_DURATION);
      const data: DisplayMessagePayload = {
        ...message,
        id: uniqid,
        showinfo: false,
        timeout,
      };

      this.messages.push(data);
    });
  }

  public ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  public toggleDetails(index: number): void {
    clearTimeout(this.messages[index].timeout);
    this.messages[index].showinfo = !this.messages[index].showinfo;
  }

  public close(index: number): void {
    this.messages.splice(index, 1);
  }

  public trackByFn(_index: number, item: DisplayMessagePayload): number {
    return item.id;
  }

  public trackByIndex(index: number): number {
    return index;
  }
}
