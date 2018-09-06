import { BrowserModule } from '@angular/platform-browser';
import { MeloaMaterialModule } from './../meloa-material/meloa-material.module';
import { OverlaysComponent } from './overlays.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogAddOverlayComponent } from './dialog-add-overlay/dialog-add-overlay.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MapModule } from './../shared/map/map.module';
import { PapaParseModule } from 'ngx-papaparse';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    MeloaMaterialModule,
    PapaParseModule,
    MapModule
  ],
  declarations: [
    OverlaysComponent,
    DialogAddOverlayComponent
  ],
  exports: [
    OverlaysComponent,
    DialogAddOverlayComponent
  ],
  entryComponents: [DialogAddOverlayComponent]
})
export class OverlaysModule { }
