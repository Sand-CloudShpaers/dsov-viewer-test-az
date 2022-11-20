import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { PopupComponent } from './popup.component';
import { PopupService } from '../../services/popup.service';

@NgModule({
  imports: [CommonModule, HttpClientModule],
  declarations: [PopupComponent],
  exports: [PopupComponent],
  providers: [PopupService],
})
export class PopupModule {}
