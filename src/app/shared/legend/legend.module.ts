import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LegendComponent } from './legend.component';
import { RampColorComponent } from './ramp-color/ramp-color.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MeloaMaterialModule } from '../../meloa-material/meloa-material.module';
import { SelectComponent } from './select/select.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    MeloaMaterialModule
  ],
  declarations: [LegendComponent, RampColorComponent, SelectComponent],
  exports: [
    LegendComponent
  ]
})
export class LegendModule { }

/* export interface LegendRamp {
  title: string,
  subtitle?: string,
  values: RangeValues
}
export interface RangeValues {
  [key: string]: string[]
}

let legend: LegendRamp = {
  title: 'Mi leyenda',
  values: {
    1: ['235'],
    2: ['1','2','34']
  }
}

let values1: RangeValues = {
  1: ['235'],
  2: ['1','2','34']
} */