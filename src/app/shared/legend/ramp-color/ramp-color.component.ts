import { LegendService } from './../legend.service';
import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';

@Component({
  selector: 'app-ramp-color',
  templateUrl: './ramp-color.component.html',
  styleUrls: ['./ramp-color.component.scss'],
  providers: [LegendService]
})
export class RampColorComponent implements OnInit, OnChanges {
  
  @Input() selectedValueLegend : number;
  colorRamp : string[] = this.getColorLegend(0);
  grades = [0, 10, 20, 50, 100];
  heights$ : number[] = [];
  velocities$ : number[] = [];
   
  constructor(private legengService : LegendService) {}

  ngOnInit() {
    //this.getGradesLegend(0);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.getValuesServiceLegend();

    if(changes['selectedValueLegend'].currentValue!==undefined) {
      let value = Number.parseInt(changes['selectedValueLegend'].currentValue);
      
      this.colorRamp = this.getColorLegend(value);
      //console.log("Setear ramp valor select ", changes['selectedValueLegend'].currentValue + " Rampa ", this.colorRamp);
      this.grades = this.getGrades(value);
    }
    
  }

  getColorLegend(value: number) {
    switch(value) {
        case 0: return ['#137fba', '#1a9641', '#ffffbf', '#e66101', '#ca0020'];
        case 1: return ['#eff3ff', '#bdd7e7', '#6baed6', '#3182bd', '#08519c'];
        case 2: return ['#FD8D3C', '#FC4E2A', '#E31A1C', '#BD0026', '#800026'];
        default: return ['#137fba', '#1a9641', '#ffffbf', '#e66101', '#ca0020'];
    }
  }

  getValuesServiceLegend() {
    this.legengService.getHeight().subscribe((height) => this.heights$ = height);
    this.legengService.getVelocities().subscribe((vel) => this.velocities$ = vel);
    this.createValuesLegend(this.heights$);
  }

  getGrades(value: number) {
    switch(value) {
      case 0: return [0, 10, 20, 50, 100];
      case 1: return [0, 12, 24, 48, 58];
      case 2: return [0, 1, 2, 3, 4];
      default: return [0, 10, 20, 50, 100];
    }
  }

  createValuesLegend(array : number[]) {
    if(array!==null) {
      let max : number = Math.max(...array);
      let min : number = Math.min(...array);
      console.log('Max ',max, 'Min ', min);
    }
  }

}
