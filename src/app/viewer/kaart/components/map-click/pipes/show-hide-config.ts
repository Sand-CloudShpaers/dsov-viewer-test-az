import { animate, AnimationTriggerMetadata, state, style, transition, trigger } from '@angular/animations';

export class ShowHideConfig {
  public static blowUp(): AnimationTriggerMetadata {
    return trigger('blowUp', [
      state('show', style({})),
      state('hide', style({ height: 0, padding: 0, minWidth: 0, left: 0, width: 0 })),
      transition('hide => show', animate('400ms ease-in-out')),
    ]);
  }
}
