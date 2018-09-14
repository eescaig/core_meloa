import { LegendService } from './../legend.service';
import { SelectValues } from './../select-values';
import { FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [LegendService]
})
export class SelectComponent implements OnInit {
  
  selectForm : FormGroup;
  @Input() selectList : SelectValues[];
  @Output() selectEvent = new EventEmitter<number>();
  disabledSelect : boolean;

  constructor(private fb : FormBuilder, private legengService : LegendService) {
    this.selectForm = this.fb.group({
      selectControl: ['']});
  }

  get select() : AbstractControl {return this.selectForm.get('selectControl');}

  ngOnInit() {
    let value : number = this.selectList[0].key;
    this.select.setValue(value);
    this.legengService.assignValueLegend(value)
    //this.checkedConditionToDisabledSelect();
  }

  /* ngOnChanges(changes: SimpleChanges) {
    console.log('Onchanges Select ', changes);
  } */

  onChangeSelect(e) {
    this.legengService.assignValueLegend(e);
    this.selectEvent.emit(e);
  }

  checkedConditionToDisabledSelect() {
    /* let heights, velocities : number[] = [];
    this.legengService.getHeight().subscribe((height) => heights = height);
    this.legengService.getVelocities().subscribe((vel) => velocities = vel);
    console.log(heights.lenght, velocities.length, ((heights.lenght==undefined || heights.lenght==0) && (velocities.length==undefined || velocities.length==0)));
    
    ((heights.lenght==undefined || heights.lenght==0) 
      && (velocities.length==undefined && velocities.length==0)) 
    ? this.disabledSelect = true 
    : this.disabledSelect = false; */
    this.legengService.getScaleObject().subscribe(e => {
                                                  console.log(e);
                                                  if(e!==null) {
                                                    this.select.enable({onlySelf: true, emitEvent: false});
                                                  }
                                                  else {
                                                    this.select.disable({onlySelf: true, emitEvent: false});
                                                  }
                                                }); 
  }

}
