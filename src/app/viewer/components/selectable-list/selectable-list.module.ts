import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectionModule } from '~store/common/selection/selection.module';
import { SelectableListComponent } from './selectable-list.component';
import { SelectableListItemComponent } from './selectable-list-item/selectable-list-item.component';
import { SymbolenModule } from '~viewer/symbolen/symbolen.module';
import { PipesModule } from '~general/pipes/pipes.module';

@NgModule({
  imports: [CommonModule, SelectionModule, SymbolenModule, PipesModule],
  declarations: [SelectableListComponent, SelectableListItemComponent],
  exports: [SelectableListComponent, SelectableListItemComponent],
})
export class SelectableListModule {}
