import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PipesModule } from '~general/pipes/pipes.module';
import { SpinnerModule } from '~viewer/components/spinner/spinner.module';
import { FilterComponent } from './filter.component';
import { FilterBoxComponent } from './components/filter-box/filter-box.component';
import { FilterConfirmationComponent } from './components/filter-confirmation/filter-confirmation.component';
import { FilterContentComponent } from './components/filter-content/filter-content.component';
import { FilterDocumenttypeComponent } from './components/filter-documenttype/filter-documenttype.component';
import { FilterLocationComponent } from './components/filter-location/filter-active-location/filter-location.component';
import { SearchComponent } from '~viewer/filter/components/filter-location/search/search/search.component';
import { LocationComponent } from './components/filter-location/location/location.component';
import { CoordinatesComponent } from '~viewer/filter/components/filter-location/coordinates/coordinates.component';
import { FilterLabelComponent } from './components/filter-label/filter-label.component';
import { DrawComponent } from './components/filter-location/draw/draw.component';
import { SymbolenModule } from '~viewer/symbolen/symbolen.module';
import { DatePickerContainerModule } from '~viewer/components/date-picker-container/date-picker-container.module';
import { SearchContainerComponent } from '~viewer/filter/components/filter-location/search/search-container/search-container.component';
import { SearchWithDateContainerComponent } from '~viewer/filter/components/filter-location/search/search-with-date-container/search-with-date-container.component';
import { FilterPanelComponent } from './components/filter-panel/filter-panel.component';
import { FilterRegelgevingtypeComponent } from './components/filter-regelgevingtype/filter-regelgevingtype.component';
import { FilterRegelsEnBeleidComponent } from './components/filter-regels-en-beleid/filter-regels-en-beleid.component';
import { FilterValueComponent } from './components/filter-value/filter-value.component';
import { AlertComponent } from './components/filter-location/alert/alert.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTooltipModule,
    PipesModule,
    SpinnerModule,
    SymbolenModule,
    DatePickerContainerModule,
    RouterModule,
  ],
  declarations: [
    FilterComponent,
    FilterPanelComponent,
    FilterContentComponent,
    FilterValueComponent,
    FilterLabelComponent,
    FilterBoxComponent,
    FilterRegelsEnBeleidComponent,
    FilterDocumenttypeComponent,
    FilterRegelgevingtypeComponent,
    FilterConfirmationComponent,
    FilterLocationComponent,
    SearchComponent,
    LocationComponent,
    CoordinatesComponent,
    DrawComponent,
    SearchContainerComponent,
    SearchWithDateContainerComponent,
    AlertComponent,
  ],
  exports: [
    FilterComponent,
    FilterPanelComponent,
    SearchComponent,
    SearchContainerComponent,
    SearchWithDateContainerComponent,
    AlertComponent,
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class FilterModule {}
