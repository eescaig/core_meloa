import { SelectValues } from './select-values';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-legend',
  templateUrl: './legend.component.html',
  styleUrls: ['./legend.component.scss']
})
export class LegendComponent implements OnInit {
  
  valuesSelect : SelectValues[] = [
      {key:0, value:'Temperature'},
      {key:1, value:'Wave height'},
      {key:2, value:'Wave velocity'}
  ];

  selectedValueLegend : number;

  constructor() {}

  ngOnInit() {}
  
  onChangeSelectLegend(event) {
    this.selectedValueLegend = event;
  }

  

}
