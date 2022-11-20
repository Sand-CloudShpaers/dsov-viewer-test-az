import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'dsov-map-panel',
  templateUrl: './map-panel.component.html',
  styleUrls: ['./map-panel.component.scss'],
})
export class MapPanelComponent implements AfterViewInit, OnDestroy, OnInit {
  @Output() public closeEventEmitter = new EventEmitter();
  @ViewChild('closeButton') closeButton: ElementRef;
  @ViewChild('content') contentWrapper: ElementRef;

  private removeKeydownListener: () => void;
  private firstFocusableElement: HTMLElement;
  private lastFocusableElement: HTMLElement;

  constructor(private readonly renderer: Renderer2, @Inject(DOCUMENT) private readonly document: Document) {}

  public ngAfterViewInit(): void {
    const focusableElements = this.contentWrapper.nativeElement.querySelectorAll('input:not([disabled])');
    if (focusableElements.length) {
      this.firstFocusableElement = focusableElements[0];
      this.lastFocusableElement = focusableElements[focusableElements.length - 1];
      this.firstFocusableElement.focus();
    }
  }

  public ngOnInit(): void {
    this.removeKeydownListener = this.renderer.listen(this.document, 'keydown', (event: KeyboardEvent) =>
      this.handleKeyboardEvent(event)
    );
  }

  public ngOnDestroy(): void {
    this.removeKeydownListener();
  }

  public close(): void {
    this.closeEventEmitter.emit();
  }

  private handleKeyboardEvent(event: KeyboardEvent): void {
    const isTabPressed = event.key === 'Tab' || event.code === 'Tab';
    const isEscapePressed = event.key === 'Escape' || event.code === 'Escape';

    if (isEscapePressed) {
      this.close();
      return;
    }

    if (!isTabPressed) {
      return;
    }

    if (event.shiftKey) {
      if (this.document.activeElement === this.closeButton.nativeElement) {
        this.lastFocusableElement?.focus();
        event.preventDefault();
      }
      if (this.document.activeElement === this.firstFocusableElement) {
        this.closeButton.nativeElement.focus();
        event.preventDefault();
      }
    } else {
      if (this.document.activeElement === this.closeButton.nativeElement) {
        this.firstFocusableElement.focus();
        event.preventDefault();
      }
      if (this.document.activeElement === this.lastFocusableElement) {
        this.closeButton.nativeElement.focus();
        event.preventDefault();
      }
    }
  }
}
