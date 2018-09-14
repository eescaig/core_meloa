import { LegendService } from './../legend.service';
import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import  * as d3 from 'd3';
import { Wavy } from '../../../catalogue-browser/shared/models/wavy.model';

@Component({
  selector: 'app-ramp-color',
  templateUrl: './ramp-color.component.html',
  styleUrls: ['./ramp-color.component.scss'],
  providers: [LegendService]
})
export class RampColorComponent implements OnInit, OnChanges {
  
  @Input() selectedValueLegend : number;
  colorRamp : string[]; // = this.getColorLegend(0);
  grades : number[] = []; //= [0, 10, 20, 50, 70, 100];
  heights$ : number[] = [];
  velocities$ : number[] = [];
  scaleObj : any = null;
   
  constructor(private legengService : LegendService) {}

  ngOnInit() {
    this.setValuesLegend(0);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.getValuesServiceLegend();

    if(changes['selectedValueLegend'].currentValue!==undefined) {
      let value = Number.parseInt(changes['selectedValueLegend'].currentValue);
      let wavysArray : Wavy[] = [];
      let latlngsPoly : number[][] = [];

      this.setValuesLegend(value);

      //Get wavysArray from catalogue-results
      this.legengService.getWavys().subscribe(wavy => {wavysArray = wavy; console.log(wavy, ' Lenght ', wavysArray.length)});
      if(wavysArray.length > 0) {
        // Remove points and polyline
        this.legengService.removePoints(wavysArray);
        this.legengService.removePolyline();
        
        // Points to paint
        wavysArray.map(obj => { latlngsPoly.push(obj.coordinates);});
        this.legengService.addPolylineToLayer(latlngsPoly, value);

        this.legengService.addPointsToLayer(wavysArray, this.scaleObj, value);
      }
    }
    //console.log('Altura ', this.heights$, ' Speed ', this.velocities$);
  }
  
  /**
   * 
   * @param value 
   */
  setValuesLegend(value: number) {
    this.colorRamp = this.getColorLegend(value);
    //console.log("Setear ramp valor select ", changes['selectedValueLegend'].currentValue + " Rampa ", this.colorRamp);
    this.grades = this.getQuantilesOfLegend(value, this.colorRamp);
    this.legengService.assignScaleObject(this.scaleObj);
  }

  /**
   * Get values from csv
   */
  getValuesServiceLegend() {
    this.legengService.getHeight().subscribe((height) => this.heights$ = height);
    this.legengService.getVelocities().subscribe((vel) => this.velocities$ = vel);
  }
  
  /**
   * Get color ramp depending of the value selected in legend
   * @param value: number
   */
  getColorLegend(value: number) {
    switch(value) {
      case 0: return ['#137fba', '#1a9641', '#ffffbf', '#e66101', '#ca0020']; //Temperature
      case 1: return ['#eff3ff', '#bdd7e7', '#6baed6', '#3182bd', '#08519c']; //Wave height
      case 2: return ['#FD8D3C', '#FC4E2A', '#E31A1C', '#BD0026', '#800026']; //Wave speed
      default: return ['#137fba', '#1a9641', '#ffffbf', '#e66101', '#ca0020'];
    }
  }
  
  /**
   * Get quantiles depending of the value selected in legend
   * @param value : number
   * @param colorRamp : string[]
   */
  getQuantilesOfLegend(value: number, colorRamp : string[]) : number[] { 
    //console.log('Value ', value);
    switch(value) {
      case 0: return this.createQuantilesLegend([0, 10, 20, 50, 70, 100], colorRamp);
      case 1: return this.createQuantilesLegend(this.heights$, colorRamp);
      case 2: return this.createQuantilesLegend(this.velocities$, colorRamp);
      default: return [0, 10, 20, 50, 70, 100];
    }
  }
  
  /**
   * Create quantiles depending of values (temperature or height or speed) and the color ramp.
   * @param array 
   * @param colorRamp 
   */
  createQuantilesLegend(array : number[], colorRamp : string[]) : number[] {
    let legend : number[] = [];
    if(array!==null) {
      let max : number = Math.max(...array);
      let min : number = Math.min(...array);
      //console.log('Max ',max, 'Min ', min, ' Color ', colorRamp);
      
      this.scaleObj = this.getScaleObj(min, max, colorRamp);
      this.legengService.assignScaleObject(this.scaleObj);

      legend = this.getLegend(min, this.scaleObj.quantiles(), max);
      //console.log(this.scaleObj(56.700) + ' quantiles ', this.scaleObj.quantiles(), ' Leyenda ', legend);
    }
    return legend;
  }

  private getScaleObj(min: number, max: number, colorRamp : string[]) : any {
    return d3.scaleQuantile().domain([min, max]).range(colorRamp);
  }

  private getLegend(min: number, quantiles: number[], max: number) : number[] {
    let legend : number[] = [];
    legend.push(Number.parseFloat(min.toFixed(2)));
    quantiles.map((item) => legend.push(Number.parseFloat(item.toFixed(2))));
    legend.push(Number.parseFloat(max.toFixed(2)));

    return legend;
  }

}
