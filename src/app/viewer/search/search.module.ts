import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SpinnerModule } from '~viewer/components/spinner/spinner.module';
import { DrawSearchService } from './services/draw-search.service';
import { SearchPageComponent } from './search-page.component';
import { FilterModule } from '~viewer/filter/filter.module';
import { HelpButtonModule } from '~viewer/components/help-button/help-button.module';

@NgModule({
  imports: [CommonModule, SpinnerModule, FilterModule, HelpButtonModule],
  declarations: [SearchPageComponent],
  exports: [SearchPageComponent],
  providers: [DrawSearchService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SearchModule {}
