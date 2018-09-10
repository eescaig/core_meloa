import { SelectValues } from './../select-values';
import { FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent implements OnInit {
  
  selectForm : FormGroup;
  @Input() selectList : SelectValues[];
  @Output() selectEvent = new EventEmitter<number>();
  selectedValue : string;

  constructor(private fb : FormBuilder) {
    this.selectForm = this.fb.group({
      selectControl: ['']});
  }

  get select() : AbstractControl {return this.selectForm.get('selectControl');}

  ngOnInit() {
    this.select.setValue(this.selectList[0].key);
  }

  onChangeSelect(e) {
    this.selectEvent.emit(e);
  }

}
