import { LegendService } from './legend.service';
import { SelectValues } from './select-values';
import { Component, OnInit, SimpleChanges, OnChanges } from '@angular/core';

@Component({
  selector: 'app-legend',
  templateUrl: './legend.component.html',
  styleUrls: ['./legend.component.scss']
})
export class LegendComponent implements OnInit, OnChanges {
  
  valuesSelect : SelectValues[] = [
      {key:0, value:'Temperature'},
      {key:1, value:'Wave height'},
      {key:2, value:'Wave velocity'}
  ];

  selectedValueLegend : number;

  constructor(public legengService : LegendService) {}

  ngOnInit() { }
  
  // PRUEBA
  ngOnChanges(changes: SimpleChanges) {
    console.log('Leyenda ', changes);
  }
  
  onChangeSelectLegend(event) {
    this.selectedValueLegend = event;
  }
}
