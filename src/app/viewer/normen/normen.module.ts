import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CollapsibleListModule } from '~viewer/components/collapsible-list/collapsible-list.module';
import { SelectableListModule } from '~viewer/components/selectable-list/selectable-list.module';
import { NormenComponent } from './normen.component';

@NgModule({
  imports: [CommonModule, CollapsibleListModule, SelectableListModule],
  declarations: [NormenComponent],
  providers: [],
  exports: [NormenComponent],
})
export class NormenModule {}
