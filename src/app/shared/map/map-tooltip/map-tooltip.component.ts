import { MapService } from './../map.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-map-tooltip',
  templateUrl: './map-tooltip.component.html',
  styleUrls: ['./map-tooltip.component.scss']
})
export class MapTooltipComponent implements OnInit {
  @Input() leftPosition: string;
  @Input() topPosition: string;
  defaultTooltipText = `Click on the map to set the vertices of your polygon.<br/>
  Click on the last vertex to finish.`
  tooltipText = `Click on the map to set the vertices of your polygon.<br/>
  Click on the last vertex to finish.`
  visibility = 'hidden'

  constructor(private ms: MapService) {
    ms.drawingChanged$.subscribe((newValue) => {
      if (newValue[0] === true) {
        this.visibility = 'visible';
        this.tooltipText = newValue[1] || this.defaultTooltipText;
      } else {
        this.visibility = 'hidden';
      }
    })
  }

  ngOnInit() {
  }

}
