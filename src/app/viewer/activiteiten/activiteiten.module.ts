import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActiviteitenComponent } from './activiteiten.component';
import { SelectableListModule } from '~viewer/components/selectable-list/selectable-list.module';

@NgModule({
  imports: [CommonModule, SelectableListModule],
  declarations: [ActiviteitenComponent],
  exports: [ActiviteitenComponent],
})
export class ActiviteitenModule {}
