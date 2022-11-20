import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GebiedsaanwijzingenComponent } from './gebiedsaanwijzingen.component';
import { CollapsibleListModule } from '~viewer/components/collapsible-list/collapsible-list.module';
import { SelectableListModule } from '~viewer/components/selectable-list/selectable-list.module';

@NgModule({
  imports: [CommonModule, CollapsibleListModule, SelectableListModule],
  declarations: [GebiedsaanwijzingenComponent],
  exports: [GebiedsaanwijzingenComponent],
})
export class GebiedsaanwijzingenModule {}
