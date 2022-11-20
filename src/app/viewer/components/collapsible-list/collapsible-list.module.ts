import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectionModule } from '~store/common/selection/selection.module';
import { CollapsibleListComponent } from './collapsible-list.component';
import { SymbolenModule } from '~viewer/symbolen/symbolen.module';
import { SelectableListModule } from '../selectable-list/selectable-list.module';

@NgModule({
  imports: [CommonModule, SelectionModule, SymbolenModule, SelectableListModule],
  declarations: [CollapsibleListComponent],
  exports: [CollapsibleListComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CollapsibleListModule {}
