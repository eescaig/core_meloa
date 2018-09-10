import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';

@Component({
  selector: 'app-ramp-color',
  templateUrl: './ramp-color.component.html',
  styleUrls: ['./ramp-color.component.scss']
})
export class RampColorComponent implements OnInit, OnChanges {
  
  @Input() selectedValueLegend : number;
  colorRamp : string[] = this.getColorLegend(0);
  grades = [0, 10, 20, 50, 100];

  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if(changes['selectedValueLegend'].currentValue!==undefined) {
      this.colorRamp = this.getColorLegend(Number.parseInt(changes['selectedValueLegend'].currentValue));
      console.log("Setear ramp valor select ", changes['selectedValueLegend'].currentValue + " Rampa ", this.colorRamp);
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

}
