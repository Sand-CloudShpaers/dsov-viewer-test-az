import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelpButtonComponent } from '~viewer/components/help-button/help-button.component';
import { DisplayErrorsModule } from '~viewer/components/display-errors/display-errors.module';

@NgModule({
  imports: [CommonModule, DisplayErrorsModule],
  declarations: [HelpButtonComponent],
  exports: [HelpButtonComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HelpButtonModule {}
