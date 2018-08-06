import { MapService } from './../shared/map/map.service';
import { Component, OnInit } from '@angular/core';
import { trigger,transition, animate, style } from '@angular/animations';

@Component({
  selector: 'app-catalogue-browser',
  templateUrl: './catalogue-browser.component.html',
  styleUrls: ['./catalogue-browser.component.scss'],
  animations: [
    trigger('rotateIcon', [
      transition('closed => open', animate(300, style({ transform: 'rotate(360deg)' }))),
      transition('open => closed', animate(300, style({ transform: 'rotate(-360deg)' })))
    ])
  ],
  providers: [MapService]
})
export class CatalogueBrowserComponent implements OnInit {
  
  progressLoading = false;
  searchResults: number;

  constructor() { 
    
  }

  ngOnInit() {
  }

}
