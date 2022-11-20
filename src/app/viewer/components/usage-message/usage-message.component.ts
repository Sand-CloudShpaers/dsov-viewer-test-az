import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { DeployService } from '~services/deploy.service';

@Component({
  selector: 'dsov-usage-message',
  templateUrl: './usage-message.component.html',
})
export class UsageMessageComponent implements AfterViewInit, OnInit {
  @Output() public acceptUsage = new EventEmitter<boolean>();
  @ViewChild('closeButton') closeButton: ElementRef;
  public showBetaContent = false;
  public openUsageMessage = true;
  private removeKeyboardEventListener: () => void;
  private readonly dsoModalClass = 'dso-modal-open';

  constructor(
    private deployService: DeployService,
    private readonly renderer: Renderer2,
    @Inject(DOCUMENT) private readonly document: Document
  ) {}

  public ngOnInit(): void {
    this.showBetaContent = this.deployService.deploy.betaContent;
    this.openUsageMessage = !UsageMessageComponent.hasAcceptedUsage();
    if (this.openUsageMessage) {
      this.renderer.addClass(this.document.body, this.dsoModalClass);
      this.removeKeyboardEventListener = this.renderer.listen(this.document, 'keydown', (event: KeyboardEvent) =>
        UsageMessageComponent.handleKeyboardEvent(event)
      );
    }
  }

  public ngAfterViewInit(): void {
    this.closeButton?.nativeElement.focus();
  }

  public close(): void {
    this.acceptUsage.emit(true);
    this.openUsageMessage = false;
    UsageMessageComponent.saveAcceptedUsage(true);
    this.renderer.removeClass(this.document.body, this.dsoModalClass);
    this.removeKeyboardEventListener();
  }

  private static saveAcceptedUsage(acceptedUsage: boolean): void {
    if (window.sessionStorage) {
      window.sessionStorage.setItem('acceptedUsage', String(acceptedUsage));
    }
  }

  private static hasAcceptedUsage(): boolean {
    if (window.sessionStorage && window.sessionStorage.getItem('acceptedUsage') != null) {
      return Boolean(window.sessionStorage.getItem('acceptedUsage'));
    }
    return false;
  }

  private static handleKeyboardEvent(event: KeyboardEvent): void {
    // Er is slechts 1 focusable element in de dialoog, die in ngAfterViewInit de focus heeft gekregen,
    // dus hier alleen voorkomen dat de focus naar buiten de dialoog gelegen tabbable en focusable
    // elements gaat
    const isTabPressed = event.key === 'Tab' || event.code === 'Tab';
    if (isTabPressed) {
      event.preventDefault();
    }
  }
}
