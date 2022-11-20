import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SelectionModule } from '~store/common/selection/selection.module';
import { SpinnerModule } from '~viewer/components/spinner/spinner.module';
import { KaartenComponent } from '~viewer/kaarten/kaarten.component';
import { CollapsibleListModule } from '~viewer/components/collapsible-list/collapsible-list.module';

@NgModule({
  imports: [CommonModule, SpinnerModule, SelectionModule, CollapsibleListModule],
  declarations: [KaartenComponent],
  exports: [KaartenComponent],
})
export class KaartenModule {}
