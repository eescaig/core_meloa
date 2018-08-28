import { Component, OnInit, AfterViewInit, ViewChild, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { MapTooltipComponent } from './map-tooltip/map-tooltip.component';
import { MapService } from './map.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit {
  
  @Input() basemap: string;
  @ViewChild(MapTooltipComponent) mapTooltipComponent: MapTooltipComponent;

  objectMap : any;

  constructor(private mapService: MapService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.objectMap = this.mapService.createMap('map');
    this.mapService.addBasemap(this.basemap);
  }

  getObjectMap() {
    return this.objectMap;
  }

  @HostListener('mousemove', ['$event'])
    onMousemove(event: any) {
      this.mapTooltipComponent.topPosition = event.clientY + 5 + 'px';
      this.mapTooltipComponent.leftPosition = event.clientX + 5 + 'px';
   }

}
