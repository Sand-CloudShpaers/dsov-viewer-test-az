import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2 } from '@angular/core';
import { DocumentViewContext } from '~viewer/documenten/types/layout.model';
import { OverlayVM } from '../types/overlayVM';

@Component({
  selector: 'dsov-overlay-panel',
  templateUrl: './overlay-panel.component.html',
  styleUrls: ['./overlay-panel.component.scss'],
})
export class OverlayPanelComponent implements OnInit, OnDestroy {
  @Input() public overlayVM: OverlayVM;

  @Output() public clickedClosePanel = new EventEmitter<void>();

  public documentViewContext = DocumentViewContext.PARTIAL_IN_OVERLAY;

  private removeKeydownListener: () => void;

  constructor(private readonly renderer: Renderer2) {}

  public ngOnInit(): void {
    this.removeKeydownListener = this.renderer.listen('body', 'keydown', (event: KeyboardEvent) =>
      this.handleKeyboardEvent(event)
    );
  }

  public ngOnDestroy(): void {
    this.removeKeydownListener();
  }

  private handleKeyboardEvent(event: KeyboardEvent): void {
    const isEscapePressed = event.key === 'Escape' || event.code === 'Escape';

    if (isEscapePressed) {
      this.closePanel();
      return;
    }
  }

  public closePanel(): void {
    this.clickedClosePanel.emit();
  }
}
