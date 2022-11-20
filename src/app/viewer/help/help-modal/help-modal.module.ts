import { CUSTOM_ELEMENTS_SCHEMA, ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelpModalComponent } from './help-modal.component';

@NgModule({
  imports: [CommonModule],
  declarations: [HelpModalComponent],
  exports: [HelpModalComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HelpModalModule {
  public static forRoot(): ModuleWithProviders<HelpModalModule> {
    return {
      ngModule: HelpModalModule,
      providers: [],
    };
  }
}
