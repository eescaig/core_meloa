import { CatalogueResultsComponent } from './catalogue-results/catalogue-results.component';
import { MapService } from './../shared/map/map.service';
import { Component, OnInit, ViewChild, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { trigger,transition, animate, style } from '@angular/animations';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { MapComponent } from '../shared/map/map.component';

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
  providers: [MapService],
  encapsulation: ViewEncapsulation.None
})
export class CatalogueBrowserComponent implements OnInit, AfterViewInit {
  
  @ViewChild('cataloguetabs') catalogueTabs;
  @ViewChild(CatalogueResultsComponent) resultsComponent;
  @ViewChild('mapCatalogue') mapComponent : MapComponent;
  progressLoading = false;
  searchResults: number;
  valueBaseMap: string = "oceans";
  iconBaseMap: string = "satellite";
  toolTipBaseMap: string = "Satellite";
  //objectMap: any;

  constructor(private mapService: MapService, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) { 
    iconRegistry.addSvgIcon('more-zoom', sanitizer.bypassSecurityTrustResourceUrl('assets/img/icons/more-zoom.svg'));
    iconRegistry.addSvgIcon('less-zoom', sanitizer.bypassSecurityTrustResourceUrl('assets/img/icons/less-zoom.svg'));
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    //this.objectMap = this.mapComponent.getObjectMap();
    /* console.log("Obteniendo mapa con get desde catalogue browser");
    console.log(this.objectMap); */
  }

  onClickChangeBaseMap() {
    if(this.iconBaseMap==="map") {
      this.iconBaseMap="satellite";
      this.toolTipBaseMap="Satellite";
      this.valueBaseMap = "oceans";
      this.reloadMap(this.valueBaseMap);
    }
    else {
      this.iconBaseMap="map";
      this.toolTipBaseMap="Bathymetry";
      this.valueBaseMap = "satellite";
      this.reloadMap(this.valueBaseMap);
    }
  }

  private reloadMap(basemap: string) {
    this.mapService.createMap('map');
    this.mapService.addBasemap(basemap);
  }

}
