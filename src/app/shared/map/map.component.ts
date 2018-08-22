import { Component, OnInit, AfterViewInit, ViewChild, HostListener, Input } from '@angular/core';
import { MapTooltipComponent } from './map-tooltip/map-tooltip.component';
import { MapService } from './map.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit {
  
  @Input() basemap: string;
  @ViewChild(MapTooltipComponent)
  private mapTooltipComponent: MapTooltipComponent;
  constructor(private mapService: MapService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.mapService.createMap('map');
    this.mapService.addBasemap(this.basemap);
    console.log('MapComponent!!!!!!!!!!!!!!!!!!');
  }

  @HostListener('mousemove', ['$event'])
    onMousemove(event: any) {
      this.mapTooltipComponent.topPosition = event.clientY + 5 + 'px';
      this.mapTooltipComponent.leftPosition = event.clientX + 5 + 'px';
   }

}
