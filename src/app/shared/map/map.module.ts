import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map.component';
import { MapTooltipComponent } from './map-tooltip/map-tooltip.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    MapComponent,
    MapTooltipComponent
  ],
  exports: [
    MapComponent
  ]
})
export class MapModule { }
