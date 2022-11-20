import { NgModule } from '@angular/core';
import { VersionNumberComponent } from './version-number.component';
import { VersionNumberService } from './version-number.service';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  imports: [CommonModule, MatTooltipModule],
  declarations: [VersionNumberComponent],
  exports: [VersionNumberComponent],
  providers: [VersionNumberService],
})
export class VersionNumberModule {}
